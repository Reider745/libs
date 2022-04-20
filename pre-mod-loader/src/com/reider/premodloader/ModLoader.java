package com.reider.premodloader;

import com.zhekasmirnov.apparatus.Apparatus;
import com.zhekasmirnov.apparatus.minecraft.version.VanillaIdConversionMap;
import com.zhekasmirnov.apparatus.modloader.ApparatusMod;
import com.zhekasmirnov.apparatus.modloader.ApparatusModLoader;
import com.zhekasmirnov.apparatus.modloader.LegacyInnerCoreMod;
import com.zhekasmirnov.apparatus.modloader.ModLoaderReporter;
import com.zhekasmirnov.horizon.runtime.logger.Logger;
import com.zhekasmirnov.innercore.api.NativeAPI;
import com.zhekasmirnov.innercore.api.Version;
import com.zhekasmirnov.innercore.api.log.ICLog;
import com.zhekasmirnov.innercore.api.log.IEventHandler;
import com.zhekasmirnov.innercore.api.log.ModLoaderEventHandler;
import com.zhekasmirnov.innercore.api.mod.adaptedscript.AdaptedScriptAPI;
import com.zhekasmirnov.innercore.api.mod.coreengine.CoreEngineAPI;
import com.zhekasmirnov.innercore.api.mod.recipes.RecipeLoader;
import com.zhekasmirnov.innercore.api.mod.recipes.furnace.FurnaceRecipeRegistry;
import com.zhekasmirnov.innercore.api.runtime.AsyncModLauncher;
import com.zhekasmirnov.innercore.api.runtime.LoadingStage;
import com.zhekasmirnov.innercore.api.runtime.other.NameTranslation;
import com.zhekasmirnov.innercore.api.runtime.other.PrintStacking;
import com.zhekasmirnov.innercore.api.unlimited.BlockRegistry;
import com.zhekasmirnov.innercore.mod.build.Mod;
import com.zhekasmirnov.innercore.mod.build.ModBuilder;
import com.zhekasmirnov.innercore.mod.executable.library.LibraryRegistry;
import com.zhekasmirnov.innercore.modpack.DirectorySetRequestHandler;
import com.zhekasmirnov.innercore.modpack.ModPack;
import com.zhekasmirnov.innercore.modpack.ModPackContext;
import com.zhekasmirnov.innercore.modpack.ModPackDirectory;
import com.zhekasmirnov.innercore.ui.LoadingUI;
import com.zhekasmirnov.mcpe161.InnerCore;
import net.lingala.zip4j.util.InternalZipConstants;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.Scriptable;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import static com.zhekasmirnov.mcpe161.InnerCore.LOGGER_TAG;

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

    public static void addPreLoad(String dir, String name){
        preloaded.add(new Loader(name, dir));
    }
    public static void forEach(IEach each){
        List<ApparatusMod> mods = ApparatusModLoader.getSingleton().getAllMods();
        for (int i = 0; i < mods.size(); i++)
            each.each(mods, mods.get(i), i);
    }

    public static void boot(HashMap map){
        AdaptedScriptAPI.Callback.addCallback("NativeGuiChanged", new Function() {
            @Override
            public Object call(Context context, Scriptable scriptable, Scriptable scriptable1, Object[] objects) {
                String name = (String) objects[0];
                if(name.equals("toast_screen") && value){
                    AdaptedScriptAPI.Callback.invokeCallback("ModsPreLoaded", null, null, null, null, null, null, null, null, null, null);

                    for(int i = 0;i < preloaded.size();i++) {
                        Loader loader = preloaded.get(i);
                        List<ApparatusMod> mods = ApparatusModLoader.getSingleton().getAllMods();
                        for (int j = 0; j < mods.size(); j++)
                            if ((((LegacyInnerCoreMod) mods.get(j)).getDirectory().getAbsolutePath() + "/").equals(loader.path)) {
                                ApparatusModLoader.getSingleton().getAllMods().remove(j);
                                break;
                            }
                        ApparatusModLoader.getSingleton().getAllMods().add(0, new LegacyInnerCoreMod(ModBuilder.buildModForDir(loader.path, ModPackContext.getInstance().getCurrentModPack(), loader.name)));
                    }

                    value = false;
                }
                return null;
            }

            @Override
            public Scriptable construct(Context context, Scriptable scriptable, Object[] objects) {
                return null;
            }

            @Override
            public String getClassName() {
                return "null";
            }

            @Override
            public Object get(String s, Scriptable scriptable) {
                return null;
            }

            @Override
            public Object get(int i, Scriptable scriptable) {
                return null;
            }

            @Override
            public boolean has(String s, Scriptable scriptable) {
                return false;
            }

            @Override
            public boolean has(int i, Scriptable scriptable) {
                return false;
            }

            @Override
            public void put(String s, Scriptable scriptable, Object o) {

            }

            @Override
            public void put(int i, Scriptable scriptable, Object o) {

            }

            @Override
            public void delete(String s) {

            }

            @Override
            public void delete(int i) {

            }

            @Override
            public Scriptable getPrototype() {
                return null;
            }

            @Override
            public void setPrototype(Scriptable scriptable) {

            }

            @Override
            public Scriptable getParentScope() {
                return null;
            }

            @Override
            public void setParentScope(Scriptable scriptable) {

            }

            @Override
            public Object[] getIds() {
                return new Object[0];
            }

            @Override
            public Object getDefaultValue(Class<?> aClass) {
                return null;
            }

            @Override
            public boolean hasInstance(Scriptable scriptable) {
                return false;
            }
        }, 0);
    }
}
