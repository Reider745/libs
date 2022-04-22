package com.reider;

import com.zhekasmirnov.apparatus.adapter.env.EnvironmentSetupProxy;
import com.zhekasmirnov.apparatus.modloader.ApparatusMod;
import com.zhekasmirnov.apparatus.modloader.ModLoaderReporter;
import com.zhekasmirnov.apparatus.multiplayer.mod.MultiplayerModList;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.Scriptable;

public class ModRunning extends ApparatusMod {
    String developer;
    String name;
    String dir;
    boolean isClient;
    String version;

    public ModRunning(boolean isClient, String name, String dir, String version){
        developer = "";
        this.name = name;
        this.dir = dir;
        this.isClient = isClient;
        this.version = version;
        updateInfo();

        if(!isClient)
            MultiplayerModList.getSingleton().add(this);
    }

    Function running;
    Function onPrepareResources;
    Context context;
    Scriptable scope;
    Scriptable _this;

    public ModRunning(Scriptable object){
        this(
                (boolean) object.get("isClient", object),
                object.has("name", object) ? (String) object.get("name", object) : "mod",
                object.has("dir", object) ? (String) object.get("dir", object) : null,
                object.has("version", object) ? (String) object.get("version", object) : "1.0"
        );
        context = Context.enter();
        scope = context.initStandardObjects();
        _this = object;
        running = object.has("onRunning", object) ? ((Function) object.get("onRunning", object)) : null;
        onPrepareResources = object.has("onPrepareResources", object) ? ((Function) object.get("onPrepareResources", object)) : null;
    }



    public void updateInfo(){
        getInfo().putProperty("multiplayer_support", true);
        getInfo().putProperty("directory_root", dir);
        getInfo().putProperty("displayed_name", name);
        getInfo().putProperty("version", "1.0");
        getInfo().putProperty("name", name);
        getInfo().putProperty("client_only", isClient);
        getInfo().putProperty("description", "");
        getInfo().putProperty("developer", "");
    }

    @Override
    public boolean isEnabledAndAbleToRun() {
        return false;
    }

    @Override
    public void onPrepareResources(ModLoaderReporter modLoaderReporter) {
        if(onPrepareResources != null)
            onPrepareResources.call(context, scope, _this, new Object[]{modLoaderReporter});
    }

    @Override
    public void onRunningMod(ModLoaderReporter modLoaderReporter) {
        if(running != null)
            running.call(context, scope, _this, new Object[]{modLoaderReporter});
    }

    @Override
    public void onSettingUpEnvironment(EnvironmentSetupProxy environmentSetupProxy, ModLoaderReporter modLoaderReporter) {

    }

    @Override
    public void onShuttingDown(ModLoaderReporter modLoaderReporter) {

    }

    public String getDeveloper() {
        return developer;
    }

    public void setDeveloper(String developer) {
        this.developer = developer;
    }
}
