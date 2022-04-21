LIBRARY({
	name: "Patched",
	version: 1,
	shared: true,
	api: "CoreEngine"
});

let PatchedJava = WRAP_JAVA("com.reider.patched.Patched");

let Flags = {
	BEFORE:0,
	AFTER:1,
	REPLACE:2
};

let Patched = {
	getReplacedFunction(orgFunc, handler, flags){
		return PatchedJava.getReplacedFunction(orgFunc, handler, flags);
	},
	patchedToObject(obj, name, func, flags){
		obj[name] = this.getReplacedFunction(obj[name], func, flags);
	}
};

EXPORT("Flags", Flags);
EXPORT("Patched", Patched);