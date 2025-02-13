<template>
  <div class="app-wrapper">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">Todo App</router-link>
      </div>
    </nav>

    <div class="main-content">
      <Suspense>
        <template #default>
          <router-view></router-view>
        </template>
        <template #fallback>
          <div class="loading-container">Loading...</div>
        </template>
      </Suspense>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  errorCaptured(err, vm, info) {
    console.error('Error captured in App.vue:', err, info, vm);
    return false;
  }
};
</script>

<style>
/* Global reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* App wrapper takes full viewport */
.app-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

/* Navbar styling */
.navbar {
  flex: 0 0 auto;
  width: 100%;
  z-index: 1000;
  padding: 0.5rem 1rem;
}

/* Main content area */
.main-content {
  flex: 1 1 auto;
  width: 100%;
  height: calc(100% - 56px); /* Subtract navbar height */
  overflow-y: auto;
  position: relative;
}

/* Loading container */
.loading-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Override Bootstrap container if needed */
.container-fluid {
  width: 100%;
  margin: 0;
  padding: 0 1rem;
}

/* Ensure router view takes full height */
.router-view {
  height: 100%;
  width: 100%;
}
</style>