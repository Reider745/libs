#include "mce.hpp"
#include <string>

#ifndef APPLESKIN_SCREENCONTEXT_HPP
#define APPLESKIN_SCREENCONTEXT_HPP


class ShaderColor {
    public:
    void makeClean() const;
    mce::Color* getColor() const;
    bool isDirty() const;
    void setColor(mce::Color const&);
};

class Tessellator {
    public:
    void begin(int, bool);
    void vertexUV(float, float, float, float, float);
};

class ScreenContext {
    public:
    char filler1[28]; // 28
    ShaderColor* shaderColor; // 32
    char filler2[72]; // 104
    Tessellator* tessellator; // 108
};

namespace RenderMesh {
    void endTessellationAndRenderImmediately(ScreenContext&, Tessellator&, void*, std::string const&);
}


#endif //APPLESKIN_SCREENCONTEXT_HPP
