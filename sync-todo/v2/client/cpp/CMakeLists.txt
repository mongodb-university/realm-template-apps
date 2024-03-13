cmake_minimum_required(VERSION 3.25)

project(sync_todo)

set(CMAKE_CXX_STANDARD 17)

Include(FetchContent)

FetchContent_Declare(
  cpprealm
  GIT_REPOSITORY https://github.com/realm/realm-cpp.git
  GIT_TAG        v1.0.0
)

FetchContent_Declare(ftxui
  GIT_REPOSITORY https://github.com/ArthurSonzogni/ftxui
  GIT_TAG v5.0.0
)

FetchContent_GetProperties(ftxui)
if(NOT ftxui_POPULATED)
  FetchContent_Populate(ftxui)
  add_subdirectory(${ftxui_SOURCE_DIR} ${ftxui_BINARY_DIR} EXCLUDE_FROM_ALL)
endif()

FetchContent_MakeAvailable(cpprealm ftxui)

add_executable(sync_todo
        main.cpp
        screens/authentication.cpp
        screens/options.cpp
        screens/static-dashboard.cpp
        data/auth-manager.cpp
        data/item.hpp
        data/item-manager.hpp
        data/item-manager.cpp
        screens/item-list.hpp
        screens/item-list.cpp
        data/item-manager.cpp
        screens/scroller.hpp
        screens/scroller.cpp
        ss.hpp
        screens/error-modal.hpp
        screens/error-modal.cpp
        display-screen.hpp
)

target_include_directories(sync_todo PRIVATE screens)

target_link_libraries(sync_todo PRIVATE cpprealm)
target_link_libraries(sync_todo PRIVATE ftxui::component)
