# 把 @froq/ui 嵌进当前项目

你在另一个项目里工作。用户要这个项目使用 froq 的 UI 库。按本文件做。库的仓库是 https://github.com/0froq/ui ，本文件在仓库根目录。

做完之后，当前项目的 `vendor/ui/` 里是这份库的完整源码，依赖是 `file:./vendor/ui`。本地 dev 和远端构建都编译这次提交里的这些文件。别的项目有自己的一份，不会跟着变。

## 禁止

- 不要 `pnpm add github:0froq/ui`，不要锁 tag，不要发 npm。
- 不要 `pnpm link`，不要 `UI_LOCAL`，不要把 `@froq/ui` alias 到本项目以外的目录。
- 不要用 git submodule。不要在 `vendor/ui` 里执行 `git init`、`git commit` 或 `git push`。
- 不要把库挪进 `packages/ui`。不要把 `vendor/ui` 写进当前项目的 `pnpm-workspace.yaml`。
- 当前项目已有的页面和组件保持不动，除非用户要你换成这个库里的组件。

`vendor/ui` 是当前项目里的普通目录，提交记在当前项目上。

## 嵌入

在当前项目的根目录操作。先确认这是一个 git 仓库，工作区是干净的，并且还没有 `vendor/ui`。工作区不干净就停下来，不要 stash。`vendor/ui` 已经存在就跳到「已经嵌过」。

```bash
git subtree add --prefix=vendor/ui https://github.com/0froq/ui.git main --squash
```

这条命令会自己产生提交。仓库是公开的，用上面的 https 地址，不需要 token。

然后把依赖加进当前项目。项目用 pnpm 时：

```bash
pnpm add ./vendor/ui
```

`package.json` 里应是 `"@froq/ui": "file:./vendor/ui"`。项目用别的包管理器时，用那个管理器的 `file:` 依赖，不要把项目改成 pnpm。锁文件和 `package.json` 一起提交。

当前项目的 eslint 如果会检查全部文件，把 `vendor/ui/**` 加进 ignore。不要用当前项目的格式规则去改库里已有的源码。

### Nuxt

在 `nuxt.config` 里加上：

```ts
build: { transpile: ['@froq/ui'] },
```

页面用到某种风格时，再把对应的样式放进 `css`，例如 `@froq/ui/paper/style.css`。没有页面要用，就不要把这些样式加进全局 `css`。

### Vite

`vendor/ui` 在项目目录里面，Vite 直接编译其中的 `.vue`。不需要 `server.fs.allow`，也不需要 alias。

### 引用

```ts
import '@froq/ui/paper/style.css'
import { Choice, Toggle } from '@froq/ui/paper'
```

```vue
<div class="ui-paper">
  <Choice v-model="tone" label="Tone" :options="[{ value: 'quiet', label: 'quiet' }, { value: 'loud', label: 'loud' }]" />
</div>
```

包名 `@froq/ui`。导出有 `./core`、`./vue`、`./paper`、`./flat`、`./term`，以及每种风格的 `./<style>/style.css` 和 `./<style>/tokens.css`。作用域类是 `ui-paper`、`ui-flat`、`ui-term`。字体不在包里。`paper` 用 Instrument Serif、Geist、Geist Mono，由当前项目自己引入。

## 在当前项目里改库

改 `vendor/ui/src/...`，保存后当前项目的 dev server 会更新。然后在当前项目根目录提交并推送。远端构建克隆的是当前项目，编到的就是这些文件。

加组件时：行为放在 `vendor/ui/src/vue/`，每种风格各写一个同名皮肤，props 保持一致。某个风格做不出来可以先不写，同名的必须是同一套 API。新风格要在 `vendor/ui/src/<name>/` 定义全部 token（`--ui-bg` `--ui-fg` `--ui-muted` `--ui-faint` `--ui-line` `--ui-accent` `--ui-font-display` `--ui-font-text` `--ui-font-meta` `--ui-ease` `--ui-dur` `--ui-radius`），把名字加入 `vendor/ui/src/core/contract.ts` 的 `STYLES`，并在 `vendor/ui/package.json` 的 `exports` 里加上入口、`style.css`、`tokens.css`。

这些改动先只存在于当前项目。不要主动推回 https://github.com/0froq/ui 。

## 送回上游

只有用户明确要求让别的项目也能拿到这些改动时，才在当前项目根目录执行：

```bash
git subtree push --prefix=vendor/ui https://github.com/0froq/ui.git main
```

推送需要用户对 `0froq/ui` 的写权限。失败就停下并说明原因，不要 force push。

## 从上游更新

只有用户明确要求跟上 ui 仓库时，才在当前项目根目录执行。`vendor/ui` 有未提交改动时，先在当前项目里提交。

```bash
git subtree pull --prefix=vendor/ui https://github.com/0froq/ui.git main --squash
```

得到的是当前项目里的普通文件 diff。看过之后再提交当前项目。

## 已经嵌过

不要再执行 `subtree add`。直接改 `vendor/ui` 里的文件，并确认依赖仍是 `file:./vendor/ui`。如果依赖还是 git 地址、tag 或 `link:`，改成 `file:./vendor/ui` 并更新锁文件。

## 核对

- `vendor/ui/package.json` 的 `name` 是 `@froq/ui`。
- 当前项目的依赖是 `file:./vendor/ui`。
- 没有 `.gitmodules` 记录这份库。
- 配置里没有 `UI_LOCAL`。
- `git status` 在当前项目根目录能看到 `vendor/ui` 的改动。
- `git -C vendor/ui status` 会失败，因为那里不是一个 git 仓库。
