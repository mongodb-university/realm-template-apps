cmake_minimum_required(VERSION 3.25)

project(sync_todo)

set(CMAKE_CXX_STANDARD 17)

Include(FetchContent)

FetchContent_Declare(cpprealm
        GIT_REPOSITORY https://github.com/realm/realm-cpp.git
        GIT_TAG        v1.0.0
)

FetchContent_Declare(ftxui
        GIT_REPOSITORY https://github.com/ArthurSonzogni/ftxui
        GIT_TAG v5.0.0
)

FetchContent_Declare(nlohmann_json
        GIT_REPOSITORY https://github.com/nlohmann/json.git
        GIT_TAG v3.11.3
)

FetchContent_GetProperties(ftxui)
if(NOT ftxui_POPULATED)
    FetchContent_Populate(ftxui)
    add_subdirectory(${ftxui_SOURCE_DIR} ${ftxui_BINARY_DIR} EXCLUDE_FROM_ALL)
endif()

FetchContent_MakeAvailable(cpprealm ftxui nlohmann_json)

add_executable(sync_todo
        app_state.hpp
        main.cpp
        controllers/app_controller.hpp
        controllers/controller.hpp
        controllers/home_controller.hpp
        controllers/login_controller.hpp
        controllers/navigation.hpp
        managers/auth_manager.hpp
        managers/error_manager.hpp
)

target_link_libraries(sync_todo PRIVATE cpprealm)
target_link_libraries(sync_todo PRIVATE ftxui::component)
target_link_libraries(sync_todo PRIVATE nlohmann_json::nlohmann_json)