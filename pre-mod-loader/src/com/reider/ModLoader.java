package com.reider;

import com.zhekasmirnov.apparatus.modloader.ApparatusMod;
import com.zhekasmirnov.apparatus.modloader.ApparatusModLoader;
import com.zhekasmirnov.apparatus.modloader.LegacyInnerCoreMod;
import com.zhekasmirnov.innercore.api.mod.adaptedscript.AdaptedScriptAPI;
import com.zhekasmirnov.innercore.api.mod.util.ScriptableFunctionImpl;
import com.zhekasmirnov.innercore.mod.build.ModBuilder;
import com.zhekasmirnov.innercore.modpack.ModPackContext;
import org.mozilla.javascript.Context;
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

    private static boolean value = true;
    private static ArrayList<Loader> preloaded = new ArrayList<>();
    private static ArrayList<Loader> PostLoaded = new ArrayList<>();

    private static String getName(String dir){
        return new File(dir).getName();
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

    public static boolean isRegisterModLoadedByName(String name){
        List<ApparatusMod> mods = ApparatusModLoader.getSingleton().getAllMods();
        for (int j = 0; j < mods.size(); j++)
            if ((((LegacyInnerCoreMod) mods.get(j)).getDirectory().getName()).equals(name))
                return true;
        return false;
    }

    public static boolean isRegisterModLoadedByDir(String dir){
        List<ApparatusMod> mods = ApparatusModLoader.getSingleton().getAllMods();
        for (int j = 0; j < mods.size(); j++)
            if ((((LegacyInnerCoreMod) mods.get(j)).getDirectory().getAbsolutePath() + "/").equals(dir))
                return true;
        return false;
    }

    public static void deleteLoadedByName(String name){
        List<ApparatusMod> mods = ApparatusModLoader.getSingleton().getAllMods();
        for (int j = 0; j < mods.size(); j++)
            if ((((LegacyInnerCoreMod) mods.get(j)).getDirectory().getName()).equals(name)) {
                ApparatusModLoader.getSingleton().getAllMods().remove(j);
                return;
            }
    }

    public static void deleteLoadedByDir(String dir){
        List<ApparatusMod> mods = ApparatusModLoader.getSingleton().getAllMods();
        for (int j = 0; j < mods.size(); j++)
            if ((((LegacyInnerCoreMod) mods.get(j)).getDirectory().getAbsolutePath() + "/").equals(dir)) {
                ApparatusModLoader.getSingleton().getAllMods().remove(j);
                return;
            }
    }

    public static int countMod(){
        return ApparatusModLoader.getSingleton().getAllMods().size();
    }

    public static void forEach(IEach each){
        List<ApparatusMod> mods = ApparatusModLoader.getSingleton().getAllMods();
        for (int i = 0; i < mods.size(); i++)
            each.each(mods, mods.get(i), i);
    }

    public static void boot(HashMap map){

        AdaptedScriptAPI.Callback.addCallback("NativeGuiChanged", new ScriptableFunctionImpl() {
            @Override
            public Object call(Context context, Scriptable scriptable, Scriptable scriptable1, Object[] objects) {
                String name = (String) objects[0];
                if(name.equals("toast_screen") && value){
                    AdaptedScriptAPI.Callback.invokeCallback("ModsPreLoaded", null, null, null, null, null, null, null, null, null, null);

                    for(int i = 0;i < preloaded.size();i++) {
                        Loader loader = preloaded.get(i);
                        deleteLoadedByDir(loader.path);
                        ApparatusModLoader.getSingleton().getAllMods().add(0, new LegacyInnerCoreMod(ModBuilder.buildModForDir(loader.path, ModPackContext.getInstance().getCurrentModPack(), loader.name)));
                    }

                    for(int i = 0;i < PostLoaded.size();i++) {
                        Loader loader = PostLoaded.get(i);
                        deleteLoadedByDir(loader.path);
                        ApparatusModLoader.getSingleton().getAllMods().add(countMod(), new LegacyInnerCoreMod(ModBuilder.buildModForDir(loader.path, ModPackContext.getInstance().getCurrentModPack(), loader.name)));
                    }

                    value = false;
                }
                return null;
            }
        }, 0);
    }
}
