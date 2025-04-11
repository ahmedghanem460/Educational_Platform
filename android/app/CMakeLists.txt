cmake_minimum_required(VERSION 3.22.1)

project("StickerSmash")

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Add React Native Reanimated
add_subdirectory(${REACT_ANDROID_DIR}/ReactCommon/react/renderer/components/view/yoga/yoga
                 ${CMAKE_CURRENT_BINARY_DIR}/yoga)

# Add your native modules here if needed
# add_library(your_module SHARED
#             your_module.cpp) 