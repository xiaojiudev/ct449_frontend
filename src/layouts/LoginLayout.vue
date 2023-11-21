<template>
  <div style="display: flex; flex-direction: row; align-items: stretch; height: 100vh; background-color: white;">
    <section style="width: 33.33%;">
      <div style="display: flex; flex-direction: column; height: 100%; color: white;">
        <a href="/" style="position: absolute; z-index: 10; top: 20px; left: 40px; font-size: 28px; font-family: cursive; color: #fff; font-weight: 400; text-decoration: none;">Dandelion</a>
        <video src="/signin.mp4" poster="/thumbnail1.png" style="display: flex; width: 100%; height: 100%; object-fit: cover;" autoplay loop muted></video>
      </div>
    </section >
    <section style="flex: 1 1 0%;">
      <div style="display: flex; align-items: center; justify-content: center; position: relative; height: 100%; width: 100%; margin: 0; padding: 0; background-color: #fbf8f8;">
        <!-- Content here -->
        <RouterView />
      </div>
    </section>
  </div>

  <!-- <slot /> -->
</template>

