# @froq/ui

froq 自己项目用的 UI 库。它不是"某一种风格的组件库",而是**一套共用的逻辑和 token 契约,加上几种风格**。同一个组件在不同风格里名字和 API 一样,换风格只需要换 import 路径。

```
src/
  core/    纯 TS,不依赖任何框架:token 契约、键盘导航、笔画几何、减弱动效判断
  vue/     无样式的行为层(useChoice 等),只依赖 Vue
  paper/   风格:纸面墨线
  flat/    风格:无隐喻的中性界面
  term/    风格:终端
playground/  三种风格并排的演示页,也是本地验证用的
```

## 风格

名字按"界面假装自己住在什么表面上"来取。

| 风格 | 表面 | 特点 |
| --- | --- | --- |
| `paper` | 纸 | 衬线做声音,一个强调色,会移动的笔画。来自 paper-landing |
| `flat` | 平的屏幕 | 中性色、系统字体、蓝色强调、圆角。项目还没有自己的声音时用它 |
| `term` | 终端 | 全等宽、无圆角、无缓动,选择会打在命令行上 |

新风格也按这个思路想,比如 `glass`、`chalk`。

## 组件

各风格都实现同样的组件,API 相同:

| 组件 | 说明 |
| --- | --- |
| `Choice` | 单选。`v-model`、`options: { value, label }[]`、可选 `label` |
| `Toggle` | 开关。`v-model`(boolean)、必填 `label`、可选 `on-label` / `off-label` |

某个风格独有的组件放在自己的目录里,比如 `paper` 的 `ChoiceCircle`(笔画圈出选中的词)。`term` 的 `Choice` 有个独有的 `prefix`:设了之后会在菜单下面的命令行里把选择敲出来,敲完才提交 model。

## Token 契约

每个风格都必须在自己的作用域类(`.ui-paper`、`.ui-flat`、`.ui-term`)上定义下面这些变量,组件只读它们,不读别的:

`--ui-bg` `--ui-fg` `--ui-muted` `--ui-faint` `--ui-line` `--ui-accent` `--ui-font-display` `--ui-font-text` `--ui-font-meta` `--ui-ease` `--ui-dur` `--ui-radius`

- 颜色用 `light-dark()`,跟随系统;在自己或祖先元素上写 `data-theme="light|dark"` 可以强制。
- 作用域是一个类,不是全局。把 `class="ui-term"` 放在页面里的一块区域上,那块区域就是终端风格,可以和别的风格混用。
- 只想要 token、不用 Vue 组件的项目,单独引 `@froq/ui/<style>/tokens.css` 就行。
- `pnpm check:tokens` 会检查每个风格都定义了全部变量。

## 使用

```ts
import '@froq/ui/paper/style.css'
import { Choice, Toggle } from '@froq/ui/paper'
```

```vue
<div class="ui-paper">
  <Choice v-model="tone" label="Tone" :options="[{ value: 'quiet', label: 'quiet' }, { value: 'loud', label: 'loud' }]" />
</div>
```

字体不打包在库里。`paper` 用 Instrument Serif、Geist、Geist Mono,项目自己引(比如 `@fontsource*`),没引就退回系统字体。

包里发的是源码(`.vue`、`.ts`、`.css`),由使用方的构建工具编译。Vite 项目直接可用;Nuxt 需要:

```ts
export default defineNuxtConfig({
  build: { transpile: ['@froq/ui'] },
  css: ['@froq/ui/paper/style.css'],
})
```

## 安装与版本

```bash
pnpm add github:0froq/ui#v0.1.0
```

发版:改 `package.json` 的 `version`,提交,打同名 tag(`v0.1.0`),推上去。使用方锁在某个 tag 上,想用新版本时才升级,库的演进不会逼着所有项目同步。

仓库目前是私有的。Cloudflare Pages 构建时要拉这个依赖,私有仓库需要在构建环境里配置访问权限;要省事就把仓库改成公开。

## 在项目里改库,又不用先推

克隆库到本地(比如 `~/code/ui`),在项目的构建配置里用环境变量切到本地目录。这份配置提交进仓库,线上没有这个变量,始终用锁定的版本:

```ts
// vite.config.ts
resolve: {
  alias: process.env.UI_LOCAL ? { '@froq/ui': `${process.env.UI_LOCAL}/src` } : {},
}
```

```bash
UI_LOCAL=~/code/ui pnpm dev
```

注意:线上构建看不到你本地没推的改动。顺序永远是:先在库里提交并打 tag,再回项目升级版本,最后推项目。

## 加一个风格

1. 建 `src/<name>/`,写 `tokens.css`(定义全部契约变量)、`style.css`(`@import './tokens.css'`)、组件和 `index.ts`。
2. 把名字加进 `src/core/contract.ts` 的 `STYLES`。
3. 在 `package.json` 的 `exports` 里加三条(入口、`style.css`、`tokens.css`)。
4. 在 `playground/src/App.vue` 加一个区块,`pnpm check` 确认契约齐全。

## 加一个组件

先在 `src/vue/` 里写行为(不管样子),再到每个风格里各写一个皮肤,名字和 props 保持一致。某个风格做不出来的组件,可以只在部分风格里有,但同名的必须同 API。

## 命令

```bash
pnpm dev            # 演示页 http://localhost:5173
pnpm build          # 构建演示页
pnpm check          # lint + 类型检查 + token 契约检查
```
