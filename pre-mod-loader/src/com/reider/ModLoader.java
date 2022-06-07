package com.reider;

import com.zhekasmirnov.apparatus.modloader.ApparatusMod;
import com.zhekasmirnov.apparatus.modloader.ApparatusModLoader;
import com.zhekasmirnov.apparatus.modloader.LegacyInnerCoreMod;
import com.zhekasmirnov.apparatus.multiplayer.mod.MultiplayerModList;
import com.zhekasmirnov.horizon.runtime.logger.Logger;
import com.zhekasmirnov.innercore.api.mod.adaptedscript.AdaptedScriptAPI;
import org.mozilla.javascript.Scriptable;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class ModLoader {
    private static class Loader {
        public String name;
        public String path;
        Loader(String name, String path){
            this.name = name;
            this.path = path;
        }
    }
    private interface IEach {
        void each(List<ApparatusMod> list, ApparatusMod mod, int index);
    }

    private static ArrayList<Loader> preloaded = new ArrayList<>();
    private static ArrayList<Loader> PostLoaded = new ArrayList<>();

    public static String getName(String dir){
        if(dir == null)
            return "";
        return new File(dir).getName();
    }
    public static List<ApparatusMod> getModList(){
        return ApparatusModLoader.getSingleton().getAllMods();
    }

    public static void addPreLoad(String dir, String name){
        preloaded.add(new Loader(name, dir));
    }
    public static void addPostLoad(String dir, String name){
        PostLoaded.add(new Loader(name, dir));
    }

    public static void addPreLoad(String dir){
        preloaded.add(new Loader(getName(dir), dir));
    }
    public static void addPostLoad(String dir){
        PostLoaded.add(new Loader(getName(dir), dir));
    }

    public static void addPreLoad(ApparatusMod mod){
        getModList().add(0, mod);
    }
    public static void addPostLoad(ApparatusMod mod){
        getModList().add(mod);
    }

    public static void addPreLoad(Scriptable mod){
        getModList().add(0, new ModRunning(mod));
    }
    public static void addPostLoad(Scriptable mod){
        getModList().add(new ModRunning(mod));
    }

    public static Mod getModByName(String name){
        List<ApparatusMod> mods = getModList();
        for (int j = 0; j < mods.size(); j++) {
            Mod mod = new Mod(mods.get(j));
            if(name.equals(mod.getName()))
                return mod;
        }
        return null;
    }

    public static Mod getModByDir(String dir){
        List<ApparatusMod> mods = getModList();
        for (int j = 0; j < mods.size(); j++) {
            Mod mod = new Mod(mods.get(j));
            if(dir.equals(mod.getDir()))
                return mod;
        }
        return null;
    }


    public static boolean isRegisterModLoadedByName(String name){
        return getModByName(name) != null;
    }

    public static boolean isRegisterModLoadedByDir(String dir){
        return getModByName(dir) != null;
    }

    public static ApparatusMod deleteLoadedByName(String name){
        List<ApparatusMod> mods = getModList();
        for (int j = 0; j < mods.size(); j++) {
            Mod mod = new Mod(mods.get(j));
            if (name.equals(mod.getName()))
                return ApparatusModLoader.getSingleton().getAllMods().remove(j);
        }
        return null;
    }

    public static ApparatusMod deleteLoadedByDir(String dir){
        List<ApparatusMod> mods = getModList();
        for (int j = 0; j < mods.size(); j++) {
            Mod mod = new Mod(mods.get(j));
            if (dir.equals(mod.getDir()))
                return ApparatusModLoader.getSingleton().getAllMods().remove(j);
        }
        return null;
    }

    public static int countMod(){
        return getModList().size();
    }

    public static void forEach(IEach each){
        List<ApparatusMod> mods = getModList();
        for (int i = 0; i < mods.size(); i++)
            each.each(mods, mods.get(i), i);
    }

    public static void boot(HashMap<?, ?> map){
        AdaptedScriptAPI.Callback.invokeCallback("ModsPreLoaded", null, null, null, null, null, null, null, null, null, null);
        for(int i = 0;i < preloaded.size();i++) {
            Loader loader = preloaded.get(i);
            LegacyInnerCoreMod mod = (LegacyInnerCoreMod) deleteLoadedByDir(loader.path);
            getModList().add(0, mod);
        }

        for(int i = 0;i < PostLoaded.size();i++) {
            Loader loader = PostLoaded.get(i);
            LegacyInnerCoreMod mod = (LegacyInnerCoreMod) deleteLoadedByDir(loader.path);
            getModList().add(countMod(), mod);
        }
    }
}
