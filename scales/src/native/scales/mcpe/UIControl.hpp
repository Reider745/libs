#ifndef APPLESKIN_UICONTROL_HPP
#define APPLESKIN_UICONTROL_HPP


struct Vec2 {
    float x, y;
};

class UIControl {
    public:
    void** vtable; // 4
    char filler[180]; // 184
    Vec2* getPosition() const;
};


#endif //APPLESKIN_UICONTROL_HPP