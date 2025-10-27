(function() {
  // 检查所有搜索结果链接，隐藏包含 csdn.net 的结果块
  function filterCsdnLinks() {
    // 获取页面中所有带 href 的链接
    const anchors = document.querySelectorAll('a[href]');
    anchors.forEach((a) => {
      const href = a.getAttribute('href');
      if (!href) return;
      try {
        // 使用 URL 解析并判断主机名是否以 csdn.net 结尾（包括子域名）
        const url = new URL(href, location.origin);
        const host = url.hostname || '';
        if (host.endsWith('csdn.net')) {
          // 尝试找到该链接所在的结果块容器
          const container = a.closest('.b_algo') || a.closest('.b_ans.b_top.b_topborder') || a.closest('li') || a.closest('[role="article"]');
          if (container) {
            container.style.display = 'none';
          } else {
            // 找不到容器就直接隐藏链接本身
            a.style.display = 'none';
          }
        }
      } catch (e) {
        // 如果 URL 解析失败，就忽略
      }
    });
  }

  // 初次执行
  filterCsdnLinks();

  // 使用 MutationObserver 监听后续动态加载的结果
  const observer = new MutationObserver((mutationsList) => {
    // 每次有变动时重新应用过滤逻辑
    filterCsdnLinks();
  });

  // 监听整个文档的子树变化，覆盖大多数动态加载场景
  observer.observe(document.body, { childList: true, subtree: true });

  // 可选：对页面的滚动加载延迟执行一次，确保初次滚动后也会被处理
  window.addEventListener('scroll', () => {
    // 小延迟避免频繁执行
    if (typeof window.__csdnFilterTimer !== 'undefined') {
      clearTimeout(window.__csdnFilterTimer);
    }
    window.__csdnFilterTimer = setTimeout(filterCsdnLinks, 300);
  }, { passive: true });
})();