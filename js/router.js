{
  /**
   * @param path 跳转路径
   * @param className 
   * @param func 切换路径后要执行的函数
   */
  const routers = [
    { path: '/', className: 'page-home', func: pageHome },
    { path: '/about', className: 'page-about', func: pageAbout },
  ]

  const { initRouter, useRoute, watch } = vue;
  initRouter({ mode: 'hash' });

  const pages = document.getElementsByClassName('page');
  let backupPages = [...pages].map(node => node.cloneNode(true));
  [...pages].forEach(node => node.remove());
  let backupNode = null;

  const route = useRoute();

  // 监听路由变化，重新挂载 dom
  watch(() => route.path, value => {
    backupNode && backupNode.remove();
    const item = routers.find(val => val.path === (value || '/'));
    if (item) {
      const pageNode = backupPages.find(node => {
        const classList = [...node.classList];
        return classList.includes(item.className);
      })
      backupNode = pageNode;
      document.body.appendChild(pageNode);
      item.func();
    }
  }, { immediate: true })

}
