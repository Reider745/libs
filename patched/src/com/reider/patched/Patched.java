package com.reider.patched;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.Scriptable;

public class Patched {
    public static Function getReplacedFunction(Function orgFunc, Function handler, int flags){
        return new Function() {
            @Override
            public Object call(Context context, Scriptable scriptable, Scriptable scriptable1, Object[] arguments) {
                Controller controller = new Controller(context, scriptable, scriptable1, orgFunc, null, arguments);
                if((flags & 2) == 2)
                    controller.setReplaced(true);

                if((flags & 0) == 0)
                    handler.call(context, scriptable, scriptable1, new Object[] {Context.javaToJS(controller, scriptable)});
                if(!controller.isReplaced())
                    controller.setResult(orgFunc.call(context, scriptable, scriptable1, controller.getArguments()));
                if((flags & 1) == 1)
                    handler.call(context, scriptable, scriptable1, new Object[] {Context.javaToJS(controller, scriptable)});
                return controller.getResult();
            }

            @Override
            public Scriptable construct(Context context, Scriptable scriptable, Object[] arguments) {
                Controller controller = new Controller(context, scriptable, scriptable, orgFunc, null, arguments);
                if((flags & 2) == 2)
                    controller.setReplaced(true);
                if((flags & 0) == 0)
                    handler.call(context, scriptable, scriptable, new Object[] {Context.javaToJS(controller, scriptable)});
                if(!controller.isReplaced())
                    controller.setResult(orgFunc.construct(context, scriptable, controller.getArguments()));
                if((flags & 1) == 1)
                    handler.call(context, scriptable, scriptable, new Object[] {Context.javaToJS(controller, scriptable)});
                return (Scriptable) controller.getResult();
            }

            @Override
            public String getClassName() {
                return orgFunc.getClassName();
            }

            @Override
            public Object get(String s, Scriptable scriptable) {
                return orgFunc.get(s, scriptable);
            }

            @Override
            public Object get(int i, Scriptable scriptable) {
                return orgFunc.get(i, scriptable);
            }

            @Override
            public boolean has(String s, Scriptable scriptable) {
                return orgFunc.has(s, scriptable);
            }

            @Override
            public boolean has(int i, Scriptable scriptable) {
                return orgFunc.has(i, scriptable);
            }

            @Override
            public void put(String s, Scriptable scriptable, Object o) {
                orgFunc.put(s, scriptable, o);
            }

            @Override
            public void put(int i, Scriptable scriptable, Object o) {
                orgFunc.put(i, scriptable, o);
            }

            @Override
            public void delete(String s) {
                orgFunc.delete(s);
            }

            @Override
            public void delete(int i) {
                orgFunc.delete(i);
            }

            @Override
            public Scriptable getPrototype() {
                return orgFunc.getPrototype();
            }

            @Override
            public void setPrototype(Scriptable scriptable) {
                orgFunc.setPrototype(scriptable);
            }

            @Override
            public Scriptable getParentScope() {
                return orgFunc.getParentScope();
            }

            @Override
            public void setParentScope(Scriptable scriptable) {
                orgFunc.setParentScope(scriptable);
            }

            @Override
            public Object[] getIds() {
                return orgFunc.getIds();
            }

            @Override
            public Object getDefaultValue(Class<?> aClass) {
                return orgFunc.getDefaultValue(aClass);
            }

            @Override
            public boolean hasInstance(Scriptable scriptable) {
                return orgFunc.hasInstance(scriptable);
            }
        };
    }
}
