import { strings } from '@angular-devkit/core';
import { apply, mergeWith, Rule, SchematicContext, Tree, url, template } from '@angular-devkit/schematics';
export interface NewModule {
  name: string;
  path: string;
}

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function newModule(_options: NewModule): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const sourceTemplates = url('./templates');
    const sourceParametrizedTemplates = apply(sourceTemplates, [
      template({
        ..._options,
        ...strings
      })
    ]);
    return mergeWith(sourceParametrizedTemplates)(tree, _context);
  };
}
