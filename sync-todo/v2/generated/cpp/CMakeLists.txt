cmake_minimum_required(VERSION 3.25)

project(sync_todo)

set(CMAKE_CXX_STANDARD 17)

Include(FetchContent)

FetchContent_Declare(cpprealm
        GIT_REPOSITORY https://github.com/realm/realm-cpp.git
        GIT_TAG        v1.1.1
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
        main.cpp
        ss.hpp
        controllers/app_controller.hpp
        controllers/app_controller.cpp
        controllers/controller.hpp
        controllers/home_controller.hpp
        controllers/home_controller.cpp
        controllers/login_controller.hpp
        controllers/login_controller.cpp
        controllers/navigation.hpp
        controllers/navigation.cpp
        managers/auth_manager.hpp
        managers/auth_manager.cpp
        managers/database_manager.hpp
        managers/database_manager.cpp
        managers/error_manager.hpp
        managers/error_manager.cpp
        state/app_config_metadata.hpp
        state/app_config_metadata.cpp
        state/app_state.hpp
        state/home_controller_state.hpp
        state/item.hpp
        views/scroller.hpp
        views/scroller.cpp
)

target_link_libraries(sync_todo PRIVATE cpprealm)
target_link_libraries(sync_todo PRIVATE ftxui::component)
target_link_libraries(sync_todo PRIVATE nlohmann_json::nlohmann_json)