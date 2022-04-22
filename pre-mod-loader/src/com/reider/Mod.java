package com.reider;

import com.zhekasmirnov.apparatus.modloader.ApparatusMod;

public class Mod {
    ApparatusMod mod;
    public Mod(ApparatusMod mod){
        this.mod = mod;
    }

    public ApparatusMod getApparatusMod() {
        return mod;
    }

    public String getDir(){
        return mod.getInfo().getProperty("directory_root", String.class, null);
    }

    public String getName(){
        return ModLoader.getName(getDir());
    }
}
