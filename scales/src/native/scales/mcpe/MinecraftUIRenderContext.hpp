#include "ScreenContext.hpp"
#include "ClientInstance.hpp"

#ifndef APPLESKIN_MINECRAFTUIRENDERCONTEXT_HPP
#define APPLESKIN_MINECRAFTUIRENDERCONTEXT_HPP

class UIScene {};

class MinecraftUIMeasureStrategy {
    public:
    void** vtable; // 4
    void* uiProfanityContext; // 8
};

class MinecraftUIRenderContext {
    public:
    void** vtable; // 4
    ClientInstance* clientInstance; // 8
    ScreenContext* screenContext; // 12
    MinecraftUIMeasureStrategy measureStrategy; // 20
    float textAlpha; // 24
    void* uiRepository; // 28
    void* textures; // 32
    void* storeCacheTextures; // 36
    char someAllocatedMemory[37]; // 73 + 3
    int someInt; // 80
    char fontHandle[28]; // 108
    char somethingMore[4]; // 112
    UIScene* uiScene; // 116
    bool someBool; // 117 + 3
    MinecraftUIRenderContext(IClientInstance&, ScreenContext&, UIScene const&);
    ScreenContext* getScreenContext() const;
};


#endif //APPLESKIN_MINECRAFTUIRENDERCONTEXT_HPP
