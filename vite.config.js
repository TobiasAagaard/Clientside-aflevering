import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  base: './',
  // Tilføj `server.hmr` for at konfigurere Hot Reload af html indhold !!!
  server: {
    watch: {
      usePolling: true,
      include:['**/*.html']
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    // rollupOptions bruges til javaScript og html filer
    rollupOptions: {
      input: {
        main: './index.html',

        // Angiv alle dine dynamisk indlæste HTML-filer
        home: './home.html',
        statiskSide: './Forklaring/StatiskSide.html',
        dynamiskSide1: './Forklaring/DynamiskSideCallbackUdenParametreTilCallbackFunktion.html',
        dynamiskSide2: './Forklaring/DynamiskSideCallbackMedEnkeltParameterTilCallbackFunktion.html',
        dynamiskSide3: './Forklaring/DynamiskSideCallbackMedArrayParameterTilCallbackFunktion.html',
        dynamiskSide4: './Forklaring/DynamiskSideCallbackMedObjektParameterTilCallbackFunktion.html',
        dynamiskSide5: './Forklaring/DynamiskSideCallbackMedArrayAfObjekterParameterTilCallbackFunktion.html',
        dynamiskSideDemo: './Forklaring/DynamiskSideCallbackDemo.html',
        jsDemo: './javaScriptPages/javaScriptDemo.html',
        jsDemoEvent: './javaScriptPages/javaScriptDemoEvent.html',
        jsBindingDynamic: './javaScriptPages/javaScriptBindingDynamic.html',
        jsClassDemo: './javaScriptPages/javaScriptClassDemo.html',
        carJS: './CarPages/javaScriptCar.html',
        carJSInitTable: './CarPages/javaScriptCarInitTable.html',
        carJSLocalStorage: './CarPages/javaScriptCarLocalStorage.html',
        carJSWebApi: './CarPages/javaScriptCarWebAPi.html',
        jQueryDemo: './jQueryPages/jQueryDemo.html',
        jQueryBindingDynamic: './jQueryPages/jQueryBindingDynamic.html',
        jQueryBindingDynamic1: './jQueryPages/jQueryBindingDynamic1.html',
        cssProperties: './CSS_Pages/ShowCSS_Properties.html',
        cssProperties1: './CSS_Pages/ShowCSS_Properties1.html',
        tsStudents: './TypeScriptPages/HandleStudents.html',
        jsTodoItemsWebApi: './WebApiPages/javaScriptTodoItemsWebApi.html',
        jQueryTodoItemsWebApi: './WebApiPages/jQueryTodoItemsWebApi.html',
        tsTodoItemsWebApi: './WebApiPages/TypeScriptTodoItemsWebApi.html',
      },
      output: {
        entryFileNames: `assets/[name]-[hash].js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`,
      },
      external: [
        /^node:/,
        'fsevents',
        'module',
        'path',
        'fs'
      ],
    }
  }
});