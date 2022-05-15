#pragma once

#include "vtable.hpp"
#include "stl/string"
#include "stl/vector"

class ActorUniqueID {
    public:
        long long id;
        ActorUniqueID(long long id) : id(id){}

        operator long long() const {
            return id;
        }
};

class ItemStackBase {
    public:
        short getId() const;
};

class ItemStack : public ItemStackBase{
    public:

};
enum ArmorSlot {};
class Actor {
    public:
        ActorUniqueID getUniqueID() const;

        short getAirSupply() const;

        std::string getNameTagVTABLE(){
            VTABLE_FIND_OFFSET(Actor_getNameTag, _ZTV5Actor, _ZNK5Actor10getNameTagEv);
            return std::string((VTABLE_CALL<std::__ndk1::string&>(Actor_getNameTag, this)).c_str());
        }

        ItemStack* getArmorSlotVTABLE(int slot){
            VTABLE_FIND_OFFSET(Actor_getArmor, _ZTV5Actor, _ZNK5Actor8getArmorE9ArmorSlot);
            return (VTABLE_CALL<ItemStack*>(Actor_getArmor, this, (ArmorSlot) slot));
        }

        int getCountArmor(){
            int count = 0;
            for(int i = 0;i < 4;i++){
                ItemStack* slot = getArmorSlotVTABLE(i);
                if(slot->getId() != 0)
                    count++;
            }
            return count;
        }
};
class Mob : public Actor {
    public:
        
};
class Player : public Mob {};
class LocalPlayer : public Player {
    public:
};
class ServerPlayer : public Player {
    public:

};