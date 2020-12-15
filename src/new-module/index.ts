import { strings } from '@angular-devkit/core';
import { classify, dasherize } from '@angular-devkit/core/src/utils/strings';
import { apply, mergeWith, Rule, SchematicContext, Tree, url, template } from '@angular-devkit/schematics';
export interface NewModule {
  name: string;
  path: string;
  appPath: string;
}

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function newModule(_options: NewModule): Rule {
  const genderNewFile = () => {
    const sourceTemplates = url('../files');
    const sourceParametrizedTemplates = apply(sourceTemplates, [
      template({
        ..._options,
        ...strings
      })
    ]);
    return sourceParametrizedTemplates;
  }
  const updateAngularFile = (tree: Tree, _options: NewModule) => {
    const angularPath = '/angular.json';
    let angularFile = tree.read(angularPath);
    if (angularFile) {
      const { name } = _options;
      const data = {
        "root": `src/app/pages/${name}`,
        "sourceRoot": `src/app/pages/${name}`,
        "projectType": "application",
        "architect": {
          "build": {
            "builder": "@angular-devkit/build-angular:browser",
            "options": {
              "outputPath": `dist/${name}`,
              "index": "src/index.html",
              "main": `src/app/pages/${name}/main.ts`,
              "polyfills": "src/polyfills.ts",
              "tsConfig": `src/app/pages/${name}/tsconfig.app.json`,
              "assets": [{
                "glob": "assets/**",
                "input": "src",
                "output": "/"
              }],
              "styles": [
                "src/styles.scss"
              ],
              "scripts": []
            },
            "configurations": {
              "dev": {
                "aot": false,
                "optimization": true,
                "buildOptimizer": false,
                "outputHashing": "all",
                "sourceMap": true,
                "extractCss": true,
                "namedChunks": false,
                "vendorChunk": false
              }
            }
          },
          "serve": {
            "builder": "@angular-devkit/build-angular:dev-server",
            "options": {
              "browserTarget": `${name}:build`
            }
          }
        }
      }
      const angularData = JSON.parse(angularFile.toString());
      angularData.projects[name] = data;
      tree.overwrite(angularPath, JSON.stringify(angularData, null, 2));
    }
  }
  const updateAppModule = (tree: Tree, _options: NewModule) => {
    const { name, appPath = 'src/app/' } = _options;
    const appModulePath = `${appPath}/app.module.ts`;
    let appModuleFile = tree.read(appModulePath);
    if (appModuleFile) {
      const contentString = appModuleFile.toString();
      const appendIndex = contentString.indexOf('AppRoutingModule,');
      const contentTwoAppend = `${classify(name)}SharedModule.forRoot(),\n    `;
      const importIndex = contentString.indexOf(`import { PlatformSharedModule } from '@app/pages/platform/platform.module';`);
      const importString = `import { ${classify(name)}SharedModule } from '@app/pages/${dasherize(name)}/${dasherize(name)}.module';\n`;
      let updatedContent = `${contentString.slice(0, appendIndex)}${contentTwoAppend}${contentString.slice(appendIndex)}`;
      updatedContent = `${updatedContent.slice(0, importIndex)}${importString}${updatedContent.slice(importIndex)}`
      tree.overwrite(appModulePath, updatedContent);
    }
  }
  return (tree: Tree, _context: SchematicContext) => {
    const newFile = genderNewFile();
    updateAngularFile(tree, _options);
    updateAppModule(tree, _options);
    return mergeWith(newFile)(tree, _context);
  };
}
