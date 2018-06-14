/**
 * @fileoverview no cycle import in es6
 * @author Theo Sun
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-cycle-import"),

    RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();

ruleTester.run("no-cycle-import", rule, {

    valid: [
        {
            filename: "test.js",
            parserOptions: {
                ecmaVersion: 6,
                sourceType: "module"
            },
            code: "import './test0001.js'",
            errors: [{
                message: "Fill me in.",
                type: "Me too"
            }]
        }
    ],

    invalid: [

    ]
});
