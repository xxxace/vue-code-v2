## template -> 编译 -> 渲染成真实DOM

- 1.获取template
- 2.template转AST

  - AST Abstract syntax tree 抽象语法树
  - 源代码的抽象语法结构的树状描述

- 3.AST -> render函数 -> _c _v _s
- 4.render函数 -> 虚拟节点
- 5.设置patch -> 真实DOM