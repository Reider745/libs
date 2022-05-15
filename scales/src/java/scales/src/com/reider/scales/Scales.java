package com.reider.scales;

import com.zhekasmirnov.innercore.api.NativeAPI;

import org.mozilla.javascript.ScriptableObject;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;

import com.zhekasmirnov.apparatus.multiplayer.NetworkJsAdapter;
import com.zhekasmirnov.innercore.api.mod.adaptedscript.AdaptedScriptAPI;
import com.zhekasmirnov.apparatus.multiplayer.client.ModdedClient;

public class Scales {
    public static interface IScaleDescription {
        String getName();
        String getFull();
        String getHelf();
        String getEmpty();
        boolean isLeft();
        boolean isReset();
    }

    private static NetworkJsAdapter network = AdaptedScriptAPI.MCSystem.getNetwork();
    private static Function getJsString = null;
    static {
        /*Context context = Context.enter();
        getJsString = context.compileFunction(context.initStandardObjects(), "funct", "scales.java", 0, null);
        network.addClientPacket("scales.setValue", new ModdedClient.OnPacketReceivedListener(){
            @Override
            public void onPacketReceived(Object o, String s, Class<?> aClass) {
                ScriptableObject object = (ScriptableObject) o;
                setValuePlayer(getScalePlayer((String) object.get("player"), (String) object.get("name")), (int) object.get("value"));
            }
        });*/
    }

    //private static long getPlayerByName(String name){
        
    //}

    //private static Object toString(String str){

    //}

    public static class ScalePlayer {
        long pointer;
        public ScalePlayer(long pointer){
            this.pointer = pointer;
        }

        public void setValue(int value){
            //network.ge
            setValuePlayer(pointer, value);
        }

        public int getValue(){
            return getValuePlayer(pointer);
        }

        public Scales getType(){
            return new Scales(getScaleType(pointer));
        }

        public void reset(){
            resetScale(pointer);
        }
    }

    native public static long registerScale(String name, String full, String helf, String empty, boolean left, boolean reset);
    native public static long getScale(String name);
    native public static boolean isScale(String name);
    native public static String getFull(long point);
    native public static String setFull(long point, String name);
    native public static String getHelf(long point);
    native public static String setHelf(long point, String name);
    native public static String getEmpty(long point);
    native public static String setEmpty(long point, String name);
    native public static String getName(long point);
    native public static boolean isLeft(long point);
    native public static boolean isReset(long point);
    native public static long getScalePlayer(String ent, String name);
    native public static void setValuePlayer(long pointer, int value);
    native public static int getValuePlayer(long pointer);
    native public static long getScaleType(long pointer);
    native public static void resetScale(long pointer);
    native public static String[] getScales();
    native public static String[] getPlayers();

    public static Scales getScaleByName(String name){
        return new Scales(getScale(name));
    }

    public static ScalePlayer getScaleByPlayer(long player, String name){
        return new ScalePlayer(getScalePlayer(NativeAPI.getNameTag(player), name));
    }

    public static ScalePlayer getScaleByPlayer(String player, String name){
        return new ScalePlayer(getScalePlayer(player, name));
    }

    public static void register(ScriptableObject description){
        new Scales(description);
    }

    public long pointer;
    public Scales(long pointer){
        this.pointer = pointer;
    }
    public Scales(IScaleDescription description){
        pointer = registerScale(
            description.getName(), 
            description.getFull(),
            description.getHelf(),
            description.getEmpty(),
            description.isLeft(),
            description.isReset()
        );
    }

    public Scales(ScriptableObject object){
        pointer = registerScale(
            (String) object.get("name"),
            (String) object.get("full"),
            (String) object.get("helf"),
            (String) object.get("empty"),
            (boolean) object.get("isLeft"),
            (boolean) object.get("isReset")
        );
    }

    public String getName(){
        return getName(pointer);
    }

    public String getFull(){
        return getFull(pointer);
    }

    public void setFull(String name){
        setFull(pointer, name);
    }

    public String getHelf(){
        return getHelf(pointer);
    }

    public void setHelf(String name){
        setHelf(pointer, name);
    }

    public String getEmpty(){
        return getEmpty(pointer);
    }

    public void setEmpty(String name){
        setEmpty(pointer, name);
    }

    public boolean isLeft(){
        return isReset(pointer);
    }

    public boolean isReset(){
        return isReset(pointer);
    }

    public IScaleDescription getScaleDescription(){
        Scales _this = this;
        return new IScaleDescription() {
            @Override
            public String getName() {
                return _this.getName();
            }
            @Override
            public String getFull() {
                return _this.getFull();
            }
            @Override
            public String getHelf() {
                return _this.getHelf();
            }
            @Override
            public String getEmpty() {
                return _this.getEmpty();
            }
            @Override
            public boolean isLeft() {
                return _this.isLeft();
            }
            @Override
            public boolean isReset() {
                return _this.isReset();
            }
        };
    }

    public ScriptableObject getScriptable(){
        ScriptableObject object = new ScriptableObject(){
            @Override
            public String getClassName() {
                return "null";
            }
        };
        object.put("name", object, getName());
        object.put("full", object, getFull());
        object.put("helf", object, getHelf());
        object.put("empty", object, getEmpty());
        object.put("isLeft", object, isLeft());
        object.put("isReset", object, isReset());
        return object;
    }
}
