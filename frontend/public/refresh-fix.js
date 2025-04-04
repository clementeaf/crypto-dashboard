// Script para prevenir redeclaración de RefreshRuntime
(function() {
  if (typeof window !== 'undefined') {
    // Guardar la referencia original
    window._originalRefreshRuntime = window.RefreshRuntime;
    
    // Eliminar la referencia actual
    delete window.RefreshRuntime;
    
    // Reemplazar con una versión controlada usando Object.defineProperty
    Object.defineProperty(window, 'RefreshRuntime', {
      configurable: true,
      enumerable: true,
      get: function() {
        return window._originalRefreshRuntime;
      },
      set: function(value) {
        // Si aún no está definido, establecerlo
        if (!window._originalRefreshRuntime) {
          window._originalRefreshRuntime = value;
        } 
        // Si ya está definido y el nuevo valor es un objeto, combinar propiedades
        else if (value && typeof value === 'object') {
          Object.assign(window._originalRefreshRuntime, value);
        }
      }
    });
    
    // También configurar polyfills para AWS Amplify
    if (typeof window.global === 'undefined') {
      window.global = window;
    }
    
    if (typeof window.process === 'undefined') {
      window.process = { 
        env: { NODE_ENV: window.location.hostname === 'localhost' ? 'development' : 'production' },
        nextTick: function(cb) { setTimeout(cb, 0); }
      };
    }
    
    if (typeof window.Buffer === 'undefined') {
      window.Buffer = {
        isBuffer: function() { return false; },
        from: function() { return {}; },
        alloc: function() { return {}; }
      };
    }
  }
})(); 