#ifndef APPLESKIN_MCE_HPP
#define APPLESKIN_MCE_HPP


class HashedString {
    public:
    char filler[20];
    HashedString(const char*);
    bool operator==(HashedString const&) const;
};


namespace mce {
    struct Color {
        float r, g, b, a;
    };
    class MaterialPtr {
        public:
        char filler[8];
    };
    class RenderMaterialGroup {
        public:
        static RenderMaterialGroup common;
        static RenderMaterialGroup switchable;
        mce::MaterialPtr getMaterial(HashedString const&);
    };
    class TexturePtr {
        public:
        static TexturePtr NONE;
        char filler[40];
        TexturePtr(TexturePtr const&);
        TexturePtr& operator=(TexturePtr const&);
    };
}


#endif //APPLESKIN_MCE_HPP