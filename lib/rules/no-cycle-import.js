/**
 * @fileoverview no cycle import in es6
 * 
 * @author Theo Sun
 */
"use strict";

const { resolve } = require
const cwd = require("process").cwd()
const { isAbsolute } = require("path")

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "no cycle import in es6",
            category: "error",
            recommended: false
        },
        fixable: false,  // or "code" or "whitespace"
        schema: [
            // fill in your schema
        ]
    },

    create: function (context) {
        const { report } = context;
        /**
         * file name
         */
        const fileName = context.getFilename();
        // only support absolutely fileName
        if (isAbsolute(fileName)) {

            return {

                /**
                 * ImportDeclaration
                 * 
                 * @param {ImportDeclaration} node 
                 */
                ImportDeclaration(node) {
                    const importName = node.source.value;

                }

            };

        } else {

            return {}

        }


    }
};
