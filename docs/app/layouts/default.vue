<template>
  <div class="site ui-paper">
    <a
      class="skip"
      href="#main"
    >跳到正文</a>
    <SiteHeader />
    <main id="main">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>
