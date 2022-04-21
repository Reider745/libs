package com.reider.patched;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.ScriptRuntime;
import org.mozilla.javascript.Scriptable;

public class Controller {
    private Object result;
    private Object[] arguments;
    private Context context;
    private Function orgFunction;
    private boolean replaced;
    private Scriptable scriptable;
    private Scriptable thas;

    public Controller(Context context, Scriptable scriptable, Scriptable thas, Function orgFunction, Object result, Object[] arguments){
        this.context = context;
        this.result = result;
        this.arguments = arguments;
        this.orgFunction = orgFunction;
        this.scriptable = scriptable;
        this.thas = thas;
        replaced = false;
    }

    public void setReplaced(boolean replaced) {
        this.replaced = replaced;
    }

    public boolean isReplaced() {
        return replaced;
    }
    public Object getValue(String name){
        return scriptable.get(name, scriptable);
    }
    public Object getThisValue(String name){
        return thas.get(name, scriptable);
    }
    public Object getContextValue(String name){
        Scriptable scr = ScriptRuntime.getTopCallScope(context);
        return scr.get(name, scr);
    }

    public void putValue(String name, Object value){
        scriptable.put(name, scriptable, value);
    }

    public void putThisValue(String name, Object value){
        thas.put(name, thas, value);
    }

    public void putContextValue(String name, Object value){
        Scriptable scr = ScriptRuntime.getTopCallScope(context);
        scr.put(name, scr, value);
    }

    public Object eval(String name){
        return context.evaluateString(scriptable, name,"patched", 1, null);
    }

    public Function getOriginalFunction() {
        return orgFunction;
    }

    public Context getContext() {
        return context;
    }

    public void setArguments(Object[] arguments) {
        this.arguments = arguments;
    }

    public void setResult(Object result) {
        this.result = result;
    }

    public Object call(){
        return getOriginalFunction().call(context, scriptable, thas, getArguments());
    }

    public Scriptable construct(){
        return getOriginalFunction().construct(context, scriptable, getArguments());
    }

    public Object[] getArguments(){
        return arguments;
    }

    public Object getResult(){
        return result;
    }
}
