// music_player.cpp
// Windows-only OBS plugin: Music Player
// Build as a shared library (DLL) for OBS (x64).
// Put this file into your plugin project and link with OBS libs.

#include <obs-module.h>
#include <windows.h>
#include <string>
#include <vector>

OBS_DECLARE_MODULE();
OBS_MODULE_USE_DEFAULT_LOCALE("music_player", "en-US");

struct mp_source {
    obs_source_t *source = nullptr;
    obs_source_t *browser = nullptr;
    HANDLE node_process = nullptr;
    std::string url;
    std::string node_path;
    std::string script_path;
    int width = 1280;
    int height = 720;
    bool autostart = false;
    std::vector<std::pair<std::string, std::string>> skins; // label -> url
};

// ---------- utils ----------
static std::wstring to_wstring(const std::string &s) {
    if (s.empty()) return std::wstring();
    int sz = MultiByteToWideChar(CP_UTF8, 0, s.c_str(), -1, nullptr, 0);
    std::wstring out(sz, L'\0');
    MultiByteToWideChar(CP_UTF8, 0, s.c_str(), -1, &out[0], sz);
    if (!out.empty() && out.back() == L'\0') out.pop_back();
    return out;
}

static bool file_exists(const std::string &path) {
    DWORD attr = GetFileAttributesA(path.c_str());
    return (attr != INVALID_FILE_ATTRIBUTES && !(attr & FILE_ATTRIBUTE_DIRECTORY));
}

// Get the directory where this DLL resides (useful to build default script paths)
static std::string get_module_dir() {
    HMODULE hm = nullptr;
    // get handle by address inside this module
    if (GetModuleHandleEx(GET_MODULE_HANDLE_EX_FLAG_FROM_ADDRESS,
                          (LPCTSTR)&get_module_dir, &hm) == 0) {
        return std::string();
    }
    wchar_t buf[MAX_PATH];
    DWORD ret = GetModuleFileNameW(hm, buf, MAX_PATH);
    // release module handle reference (we used GET_MODULE_HANDLE_EX_FLAG_FROM_ADDRESS without incrementing ref? it's fine)
    // No explicit FreeLibrary call needed here.
    if (ret == 0) return std::string();
    std::wstring ws(buf);
    // strip file name
    size_t pos = ws.find_last_of(L"\\/");
    if (pos == std::wstring::npos) return std::string();
    std::wstring dir = ws.substr(0, pos);
    // convert to utf8
    int sz = WideCharToMultiByte(CP_UTF8, 0, dir.c_str(), -1, nullptr, 0, nullptr, nullptr);
    std::string out(sz, '\0');
    WideCharToMultiByte(CP_UTF8, 0, dir.c_str(), -1, &out[0], sz, nullptr, nullptr);
    if (!out.empty() && out.back() == '\0') out.pop_back();
    return out;
}

// ---------- process control ----------
static bool start_node_process(mp_source *s) {
    if (!s) return false;
    if (s->node_process) return true; // already running
    if (s->node_path.empty() || s->script_path.empty()) return false;
    if (!file_exists(s->node_path) || !file_exists(s->script_path)) return false;

    std::wstring node = to_wstring(s->node_path);
    std::wstring script = to_wstring(s->script_path);

    // Build command line: "C:\path\node.exe" "C:\path\backend\index.js"
    std::wstring cmd = L"\"";
    cmd += node;
    cmd += L"\" \"";
    cmd += script;
    cmd += L"\"";

    STARTUPINFOW si;
    PROCESS_INFORMATION pi;
    ZeroMemory(&si, sizeof(si));
    ZeroMemory(&pi, sizeof(pi));
    si.cb = sizeof(si);

    BOOL ok = CreateProcessW(
        nullptr,
        &cmd[0],
        nullptr,
        nullptr,
        FALSE,
        CREATE_NO_WINDOW,
        nullptr,
        nullptr,
        &si,
        &pi
    );

    if (!ok) {
        blog(LOG_WARNING, "MusicPlayer: CreateProcessW failed (%lu)", GetLastError());
        return false;
    }

    CloseHandle(pi.hThread);
    s->node_process = pi.hProcess;
    blog(LOG_INFO, "MusicPlayer: started node (pid=%lu)", GetProcessId(s->node_process));
    return true;
}

static void stop_node_process(mp_source *s) {
    if (!s || !s->node_process) return;

    // Try graceful: send CTRL+C not trivial to do for detached process; fallback to TerminateProcess
    DWORD pid = GetProcessId(s->node_process);
    TerminateProcess(s->node_process, 0);
    CloseHandle(s->node_process);
    s->node_process = nullptr;
    blog(LOG_INFO, "MusicPlayer: terminated node (pid=%lu)", pid);
}

// ---------- OBS callbacks ----------
static const char *mp_get_name(void *unused) {
    UNUSED_PARAMETER(unused);
    return "Music Player";
}

static void mp_fill_default_skins(mp_source *s) {
    s->skins.clear();
    // === ADD DEFAULT SKINS HERE (label, url) ===
    // You (or your installer) can change/add lines below
    s->skins.emplace_back("BackPicture", "http://localhost:27272/player?BackPicture");
    s->skins.emplace_back("AnotherSkin", "http://localhost:27272/player?AnotherSkin");
    // ===========================================
}

static void *mp_create(obs_data_t *settings, obs_source_t *source) {
    mp_source *s = new mp_source();
    s->source = source;

    const char *url = obs_data_get_string(settings, "url");
    const char *nodep = obs_data_get_string(settings, "node_path");
    const char *scriptp = obs_data_get_string(settings, "script_path");

    // defaults
    s->url = url && url[0] ? url : "http://localhost:27272/player?BackPicture";
    s->node_path = nodep && nodep[0] ? nodep : "";
    s->script_path = scriptp && scriptp[0] ? scriptp : "";

    s->width = (int)obs_data_get_int(settings, "width");
    s->height = (int)obs_data_get_int(settings, "height");
    s->autostart = obs_data_get_bool(settings, "autostart");

    // fill skins (default list, can be edited in code)
    mp_fill_default_skins(s);

    // Create an internal browser_source and render the URL
    obs_data_t *bs = obs_data_create();
    obs_data_set_string(bs, "url", s->url.c_str());
    obs_data_set_int(bs, "width", s->width);
    obs_data_set_int(bs, "height", s->height);
    s->browser = obs_source_create("browser_source", "mp_internal_browser", bs, nullptr);
    obs_data_release(bs);

    // Try autostart if requested (best-effort)
    if (s->autostart && !s->node_path.empty() && !s->script_path.empty()) {
        if (!start_node_process(s)) {
            blog(LOG_WARNING, "MusicPlayer: autostart requested but failed to start node.");
        }
    }

    return s;
}

static void mp_destroy(void *data) {
    mp_source *s = (mp_source*)data;
    if (!s) return;

    if (s->browser) {
        obs_source_release(s->browser);
        s->browser = nullptr;
    }

    stop_node_process(s);

    delete s;
}

static void mp_update(void *data, obs_data_t *settings) {
    mp_source *s = (mp_source*)data;
    if (!s) return;

    // read values (the settings object has the UI state)
    const char *url = obs_data_get_string(settings, "url");
    const char *nodep = obs_data_get_string(settings, "node_path");
    const char *scriptp = obs_data_get_string(settings, "script_path");
    const char *skin_selected = obs_data_get_string(settings, "skin");

    if (nodep && nodep[0]) s->node_path = nodep;
    if (scriptp && scriptp[0]) s->script_path = scriptp;
    s->width = (int)obs_data_get_int(settings, "width");
    s->height = (int)obs_data_get_int(settings, "height");
    bool want_autostart = obs_data_get_bool(settings, "autostart");

    // If user chose a skin from the dropdown we map it to url
    if (skin_selected && skin_selected[0]) {
        std::string sk(skin_selected);
        // find in map
        for (auto &p : s->skins) {
            if (p.first == sk) {
                s->url = p.second;
                break;
            }
        }
    } else if (url && url[0]) {
        s->url = url;
    }

    // Start/stop node if autostart toggled
    if (want_autostart && !s->node_process) {
        start_node_process(s);
    } else if (!want_autostart && s->node_process) {
        stop_node_process(s);
    }

    // Update browser source
    if (s->browser) {
        obs_data_t *bs = obs_data_create();
        obs_data_set_string(bs, "url", s->url.c_str());
        obs_data_set_int(bs, "width", s->width);
        obs_data_set_int(bs, "height", s->height);
        obs_source_update(s->browser, bs);
        obs_data_release(bs);
    }
}

static obs_properties_t *mp_get_properties(void *data) {
    UNUSED_PARAMETER(data);
    obs_properties_t *props = obs_properties_create();

    // URL text field (manual)
    obs_properties_add_text(props, "url", "Player URL", OBS_TEXT_DEFAULT);

    // dropdown of skins (label -> url). You can add your URLs here as defaults.
    obs_property_t *p = obs_properties_add_list(props, "skin", "Choose skin (examples)", OBS_COMBO_TYPE_LIST, OBS_COMBO_FORMAT_STRING);
    // The labels below are what user sees; the second param (string) is the underlying value.
    obs_property_list_add_string(p, "None", "");
    obs_property_list_add_string(p, "BackPicture", "BackPicture");
    obs_property_list_add_string(p, "AnotherSkin", "AnotherSkin");
    // NOTE: these entries correspond to the labels added in mp_fill_default_skins()

    obs_properties_add_text(props, "node_path", "Node executable path (optional)", OBS_TEXT_DEFAULT);
    obs_properties_add_text(props, "script_path", "Backend script path (optional)", OBS_TEXT_DEFAULT);

    obs_properties_add_int(props, "width", "Width", 100, 7680, 1);
    obs_properties_add_int(props, "height", "Height", 100, 4320, 1);

    obs_properties_add_bool(props, "autostart", "Autostart backend (start node + script)", false);

    obs_properties_add_bool(props, "dummy", "Note: set URL or choose skin + optionally configure Node paths", false);

    return props;
}

static void mp_video_render(void *data, gs_effect_t *effect) {
    UNUSED_PARAMETER(effect);
    mp_source *s = (mp_source*)data;
    if (!s) return;
    if (s->browser) {
        // delegate rendering to the internal browser source
        obs_source_video_render(s->browser);
    }
}

static struct obs_source_info mp_source_info = {
    .id = "music_player_source",
    .type = OBS_SOURCE_TYPE_INPUT,
    .output_flags = OBS_SOURCE_VIDEO,
    .get_name = mp_get_name,
    .create = mp_create,
    .destroy = mp_destroy,
    .update = mp_update,
    .get_properties = mp_get_properties,
    .video_render = mp_video_render
};

extern "C" bool obs_module_load(void) {
    obs_register_source(&mp_source_info);
    blog(LOG_INFO, "MusicPlayer: module loaded");
    return true;
}
