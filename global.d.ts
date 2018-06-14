// Type definitions for ESTree AST specification
// Project: https://github.com/estree/estree
// Definitions by: RReverser <https://github.com/RReverser>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

// This definition file follows a somewhat unusual format. ESTree allows
// runtime type checks based on the `type` parameter. In order to explain this
// to typescript we want to use discriminated union types:
// https://github.com/Microsoft/TypeScript/pull/9163
//
// For ESTree this is a bit tricky because the high level interfaces like
// Node or Function are pulling double duty. We want to pass common fields down
// to the interfaces that extend them (like Identifier or
// ArrowFunctionExpression), but you can't extend a type union or enforce
// common fields on them. So we've split the high level interfaces into two
// types, a base type which passes down inhereted fields, and a type union of
// all types which extend the base type. Only the type union is declareed, and
// the union is how other types refer to the collection of inheriting types.
//
// This makes the definitions file here somewhat more difficult to maintain,
// but it has the notable advantage of making ESTree much easier to use as
// an end user.

interface BaseNodeWithoutComments {
  // Every leaf interface that extends BaseNode must specify a type property.
  // The type property should be a string literal. For example, Identifier
  // has: `type: "Identifier"`
  type: string;
  loc?: SourceLocation | null;
  range?: [number, number];
}

interface BaseNode extends BaseNodeWithoutComments {
  leadingComments?: Array<Comment>;
  trailingComments?: Array<Comment>;
}

declare type Node =
    Identifier | Literal | Program | Function | SwitchCase | CatchClause |
    VariableDeclarator | Statement | Expression | Property |
    AssignmentProperty | Super | TemplateElement | SpreadElement | Pattern |
    ClassBody | Class | MethodDefinition | ModuleDeclaration | ModuleSpecifier;

declare interface Comment extends BaseNodeWithoutComments {
  type: "Line" | "Block";
  value: string;
}

interface SourceLocation {
  source?: string | null;
  start: Position;
  end: Position;
}

declare interface Position {
  /** >= 1 */
  line: number;
  /** >= 0 */
  column: number;
}

declare interface Program extends BaseNode {
  type: "Program";
  sourceType: "script" | "module";
  body: Array<Statement | ModuleDeclaration>;
  comments?: Array<Comment>;
}

interface BaseFunction extends BaseNode {
  params: Array<Pattern>;
  generator?: boolean;
  async?: boolean;
  // The body is either BlockStatement or Expression because arrow functions
  // can have a body that's either. FunctionDeclarations and
  // FunctionExpressions have only BlockStatement bodies.
  body: BlockStatement | Expression;
}

declare type Function =
    FunctionDeclaration | FunctionExpression | ArrowFunctionExpression;

declare type Statement =
    ExpressionStatement | BlockStatement | EmptyStatement |
    DebuggerStatement | WithStatement | ReturnStatement | LabeledStatement |
    BreakStatement | ContinueStatement | IfStatement | SwitchStatement |
    ThrowStatement | TryStatement | WhileStatement | DoWhileStatement |
    ForStatement | ForInStatement | ForOfStatement | Declaration;

interface BaseStatement extends BaseNode { }

declare interface EmptyStatement extends BaseStatement {
  type: "EmptyStatement";
}

declare interface BlockStatement extends BaseStatement {
  type: "BlockStatement";
  body: Array<Statement>;
  innerComments?: Array<Comment>;
}

declare interface ExpressionStatement extends BaseStatement {
  type: "ExpressionStatement";
  expression: Expression;
}

declare interface IfStatement extends BaseStatement {
  type: "IfStatement";
  test: Expression;
  consequent: Statement;
  alternate?: Statement | null;
}

declare interface LabeledStatement extends BaseStatement {
  type: "LabeledStatement";
  label: Identifier;
  body: Statement;
}

declare interface BreakStatement extends BaseStatement {
  type: "BreakStatement";
  label?: Identifier | null;
}

declare interface ContinueStatement extends BaseStatement {
  type: "ContinueStatement";
  label?: Identifier | null;
}

declare interface WithStatement extends BaseStatement {
  type: "WithStatement";
  object: Expression;
  body: Statement;
}

declare interface SwitchStatement extends BaseStatement {
  type: "SwitchStatement";
  discriminant: Expression;
  cases: Array<SwitchCase>;
}

declare interface ReturnStatement extends BaseStatement {
  type: "ReturnStatement";
  argument?: Expression | null;
}

declare interface ThrowStatement extends BaseStatement {
  type: "ThrowStatement";
  argument: Expression;
}

declare interface TryStatement extends BaseStatement {
  type: "TryStatement";
  block: BlockStatement;
  handler?: CatchClause | null;
  finalizer?: BlockStatement | null;
}

declare interface WhileStatement extends BaseStatement {
  type: "WhileStatement";
  test: Expression;
  body: Statement;
}

declare interface DoWhileStatement extends BaseStatement {
  type: "DoWhileStatement";
  body: Statement;
  test: Expression;
}

declare interface ForStatement extends BaseStatement {
  type: "ForStatement";
  init?: VariableDeclaration | Expression | null;
  test?: Expression | null;
  update?: Expression | null;
  body: Statement;
}

interface BaseForXStatement extends BaseStatement {
  left: VariableDeclaration | Pattern;
  right: Expression;
  body: Statement;
}

declare interface ForInStatement extends BaseForXStatement {
  type: "ForInStatement";
}

declare interface DebuggerStatement extends BaseStatement {
  type: "DebuggerStatement";
}

declare type Declaration =
      FunctionDeclaration | VariableDeclaration | ClassDeclaration;

interface BaseDeclaration extends BaseStatement { }

declare interface FunctionDeclaration extends BaseFunction, BaseDeclaration {
  type: "FunctionDeclaration";
  /** It is null when a function declaration is a part of the `declare default function` statement */
  id: Identifier | null;
  body: BlockStatement;
}

declare interface VariableDeclaration extends BaseDeclaration {
  type: "VariableDeclaration";
  declarations: Array<VariableDeclarator>;
  kind: "var" | "let" | "const";
}

declare interface VariableDeclarator extends BaseNode {
  type: "VariableDeclarator";
  id: Pattern;
  init?: Expression | null;
}

type Expression =
    ThisExpression | ArrayExpression | ObjectExpression | FunctionExpression |
    ArrowFunctionExpression | YieldExpression | Literal | UnaryExpression |
    UpdateExpression | BinaryExpression | AssignmentExpression |
    LogicalExpression | MemberExpression | ConditionalExpression |
    CallExpression | NewExpression | SequenceExpression | TemplateLiteral |
    TaggedTemplateExpression | ClassExpression | MetaProperty | Identifier |
    AwaitExpression;

declare interface BaseExpression extends BaseNode { }

declare interface ThisExpression extends BaseExpression {
  type: "ThisExpression";
}

declare interface ArrayExpression extends BaseExpression {
  type: "ArrayExpression";
  elements: Array<Expression | SpreadElement>;
}

declare interface ObjectExpression extends BaseExpression {
  type: "ObjectExpression";
  properties: Array<Property>;
}

declare interface Property extends BaseNode {
  type: "Property";
  key: Expression;
  value: Expression | Pattern; // Could be an AssignmentProperty
  kind: "init" | "get" | "set";
  method: boolean;
  shorthand: boolean;
  computed: boolean;
}

declare interface FunctionExpression extends BaseFunction, BaseExpression {
  id?: Identifier | null;
  type: "FunctionExpression";
  body: BlockStatement;
}

declare interface SequenceExpression extends BaseExpression {
  type: "SequenceExpression";
  expressions: Array<Expression>;
}

declare interface UnaryExpression extends BaseExpression {
  type: "UnaryExpression";
  operator: UnaryOperator;
  prefix: true;
  argument: Expression;
}

declare interface BinaryExpression extends BaseExpression {
  type: "BinaryExpression";
  operator: BinaryOperator;
  left: Expression;
  right: Expression;
}

declare interface AssignmentExpression extends BaseExpression {
  type: "AssignmentExpression";
  operator: AssignmentOperator;
  left: Pattern | MemberExpression;
  right: Expression;
}

declare interface UpdateExpression extends BaseExpression {
  type: "UpdateExpression";
  operator: UpdateOperator;
  argument: Expression;
  prefix: boolean;
}

declare interface LogicalExpression extends BaseExpression {
  type: "LogicalExpression";
  operator: LogicalOperator;
  left: Expression;
  right: Expression;
}

declare interface ConditionalExpression extends BaseExpression {
  type: "ConditionalExpression";
  test: Expression;
  alternate: Expression;
  consequent: Expression;
}

interface BaseCallExpression extends BaseExpression {
  callee: Expression | Super;
  arguments: Array<Expression | SpreadElement>;
}
declare type CallExpression = SimpleCallExpression | NewExpression;

declare interface SimpleCallExpression extends BaseCallExpression {
  type: "CallExpression";
}

declare interface NewExpression extends BaseCallExpression {
  type: "NewExpression";
}

declare interface MemberExpression extends BaseExpression, BasePattern {
  type: "MemberExpression";
  object: Expression | Super;
  property: Expression;
  computed: boolean;
}

declare type Pattern =
    Identifier | ObjectPattern | ArrayPattern | RestElement |
    AssignmentPattern | MemberExpression;

interface BasePattern extends BaseNode { }

declare interface SwitchCase extends BaseNode {
  type: "SwitchCase";
  test?: Expression | null;
  consequent: Array<Statement>;
}

declare interface CatchClause extends BaseNode {
  type: "CatchClause";
  param: Pattern;
  body: BlockStatement;
}

declare interface Identifier extends BaseNode, BaseExpression, BasePattern {
  type: "Identifier";
  name: string;
}

declare type Literal = SimpleLiteral | RegExpLiteral;

declare interface SimpleLiteral extends BaseNode, BaseExpression {
  type: "Literal";
  value: string | boolean | number | null;
  raw?: string;
}

declare interface RegExpLiteral extends BaseNode, BaseExpression {
  type: "Literal";
  value?: RegExp | null;
  regex: {
    pattern: string;
    flags: string;
  };
  raw?: string;
}

declare type UnaryOperator =
    "-" | "+" | "!" | "~" | "typeof" | "void" | "delete";

declare type BinaryOperator =
    "==" | "!=" | "===" | "!==" | "<" | "<=" | ">" | ">=" | "<<" |
    ">>" | ">>>" | "+" | "-" | "*" | "/" | "%" | "**" | "|" | "^" | "&" | "in" |
    "instanceof";

declare type LogicalOperator = "||" | "&&";

declare type AssignmentOperator =
    "=" | "+=" | "-=" | "*=" | "/=" | "%=" | "**=" | "<<=" | ">>=" | ">>>=" |
    "|=" | "^=" | "&=";

declare type UpdateOperator = "++" | "--";

declare interface ForOfStatement extends BaseForXStatement {
  type: "ForOfStatement";
}

declare interface Super extends BaseNode {
  type: "Super";
}

declare interface SpreadElement extends BaseNode {
  type: "SpreadElement";
  argument: Expression;
}

declare interface ArrowFunctionExpression extends BaseExpression, BaseFunction {
  type: "ArrowFunctionExpression";
  expression: boolean;
  body: BlockStatement | Expression;
}

declare interface YieldExpression extends BaseExpression {
  type: "YieldExpression";
  argument?: Expression | null;
  delegate: boolean;
}

declare interface TemplateLiteral extends BaseExpression {
  type: "TemplateLiteral";
  quasis: Array<TemplateElement>;
  expressions: Array<Expression>;
}

declare interface TaggedTemplateExpression extends BaseExpression {
  type: "TaggedTemplateExpression";
  tag: Expression;
  quasi: TemplateLiteral;
}

declare interface TemplateElement extends BaseNode {
  type: "TemplateElement";
  tail: boolean;
  value: {
    cooked: string;
    raw: string;
  };
}

declare interface AssignmentProperty extends Property {
  value: Pattern;
  kind: "init";
  method: boolean; // false
}

declare interface ObjectPattern extends BasePattern {
  type: "ObjectPattern";
  properties: Array<AssignmentProperty>;
}

declare interface ArrayPattern extends BasePattern {
  type: "ArrayPattern";
  elements: Array<Pattern>;
}

declare interface RestElement extends BasePattern {
  type: "RestElement";
  argument: Pattern;
}

declare interface AssignmentPattern extends BasePattern {
  type: "AssignmentPattern";
  left: Pattern;
  right: Expression;
}

declare type Class = ClassDeclaration | ClassExpression;
interface BaseClass extends BaseNode {
  superClass?: Expression | null;
  body: ClassBody;
}

declare interface ClassBody extends BaseNode {
  type: "ClassBody";
  body: Array<MethodDefinition>;
}

declare interface MethodDefinition extends BaseNode {
  type: "MethodDefinition";
  key: Expression;
  value: FunctionExpression;
  kind: "constructor" | "method" | "get" | "set";
  computed: boolean;
  static: boolean;
}

declare interface ClassDeclaration extends BaseClass, BaseDeclaration {
  type: "ClassDeclaration";
  /** It is null when a class declaration is a part of the `declare default class` statement */
  id: Identifier | null;
}

declare interface ClassExpression extends BaseClass, BaseExpression {
  type: "ClassExpression";
  id?: Identifier | null;
}

declare interface MetaProperty extends BaseExpression {
  type: "MetaProperty";
  meta: Identifier;
  property: Identifier;
}

declare type ModuleDeclaration =
    ImportDeclaration | declareNamedDeclaration | declareDefaultDeclaration |
    declareAllDeclaration;
interface BaseModuleDeclaration extends BaseNode { }

declare type ModuleSpecifier =
    ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier |
    declareSpecifier;
interface BaseModuleSpecifier extends BaseNode {
  local: Identifier;
}

declare interface ImportDeclaration extends BaseModuleDeclaration {
  type: "ImportDeclaration";
  specifiers: Array<ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier>;
  source: Literal;
}

declare interface ImportSpecifier extends BaseModuleSpecifier {
  type: "ImportSpecifier";
  imported: Identifier;
}

declare interface ImportDefaultSpecifier extends BaseModuleSpecifier {
  type: "ImportDefaultSpecifier";
}

declare interface ImportNamespaceSpecifier extends BaseModuleSpecifier {
  type: "ImportNamespaceSpecifier";
}

declare interface declareNamedDeclaration extends BaseModuleDeclaration {
  type: "declareNamedDeclaration";
  declaration?: Declaration | null;
  specifiers: Array<declareSpecifier>;
  source?: Literal | null;
}

declare interface declareSpecifier extends BaseModuleSpecifier {
  type: "declareSpecifier";
  declareed: Identifier;
}

declare interface declareDefaultDeclaration extends BaseModuleDeclaration {
  type: "declareDefaultDeclaration";
  declaration: Declaration | Expression;
}

declare interface declareAllDeclaration extends BaseModuleDeclaration {
  type: "declareAllDeclaration";
  source: Literal;
}

declare interface AwaitExpression extends BaseExpression {
  type: "AwaitExpression";
  argument: Expression;
}