class BaseClass { }

export class ErrorOverlay extends BaseClass {
  connectedCallback() {
    this.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:99999;background:white;display:flex;align-items:center;justify-content:center;flex-direction:column;font-family:sans-serif;';
    this.innerHTML = `<img src="/error.svg" style="width:180px;margin-bottom:24px" alt="Error"/><h1 style="font-size:16px;font-weight:500;margin:0 0 8px">Something went wrong</h1><p style="font-size:14px;color:#666;margin:0">Check the console for details.</p>`;
  }

  constructor(err, type) {
    super();
    console.error('[ErrorOverlay]', type, err);
  }
}

const customErrorOverlayPlugin = () => ({
  name: 'custom-error-overlay',
  transform(code, id, opts = {}) {
    if (!id.includes('vite/dist/client/client.mjs') || opts?.ssr) return;
    const errorOverlayCustomElement = ErrorOverlay.toString().replace('extends BaseClass', 'extends HTMLElement');
    return code.replace('class ErrorOverlay', `${errorOverlayCustomElement}\nclass OldErrorOverlay`);
  },
});

export default customErrorOverlayPlugin;
