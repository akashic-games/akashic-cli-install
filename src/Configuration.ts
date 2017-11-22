import * as cmn from "@akashic/akashic-cli-commons";

export class Configuration extends cmn.Configuration {
	addOperationPlugin(code: number, moduleName: string): void {
		if (! this._content.operationPlugins)
			this._content.operationPlugins = [];
		var existingIndex = this.findExistingOperationPluginIndex(code);
		if (existingIndex !== -1) {
			throw new Error("Conflicted code for operation plugins. Code " + code + " is already used");
		}
		this._content.operationPlugins.push({
			code: code,
			script: cmn.Util.makeModuleNameNoVer(moduleName)
		});
	}

	findExistingOperationPluginIndex(code: number): number {
		return (this._content.operationPlugins || []).findIndex((p) => (p.code === code));
	}

	addToGlobalScripts(filepaths: string[]): void {
		this._logger.info("Adding file paths to globalScripts...");
		if (!this._content.globalScripts) {
			this._content.globalScripts = filepaths;
		} else {
			filepaths = filepaths.filter((filePath: string) => {
				return (this._content.globalScripts.indexOf(filePath) === -1);
			});
			this._content.globalScripts = this._content.globalScripts.concat(filepaths);
		}
	}

	addToModuleMainScripts(packageJsonFiles: string[]): void {
		this._logger.info("Adding file paths to moduleMainScripts...");
		if (! this._content.moduleMainScripts) {
			this._logger.warn("`moduleMainScripts` doesn't existed in game.json. Please use akashic-engine@>=2.0.1, >=1.11.2");
		}
		var moduleMainScripts = this._content.moduleMainScripts || {};
		Object.assign(moduleMainScripts, cmn.NodeModules.listModuleMainScripts(packageJsonFiles));
		this._content.moduleMainScripts = moduleMainScripts;
	}
}
