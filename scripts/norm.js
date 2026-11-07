(() => {
  const canonStyle = el => {
    if (!el.hasAttribute('style')) return;
    let css = el.style.cssText || '';
    const decls = css.split(';').map(x => x.trim()).filter(Boolean).sort();
    el.setAttribute('style', decls.join(';'));
  };
  const norm = html => {
    const div = document.createElement('div');
    div.innerHTML = html;
    div.querySelectorAll('*').forEach(el => {
      [...el.attributes].forEach(a => { if (/^on[a-z]+$/i.test(a.name)) el.removeAttribute(a.name); });
      canonStyle(el);
      // فرز السمات بالاسم: ترتيب السمات لا يؤثر على العرض إطلاقاً
      const names = [...el.attributes].map(a => a.name).sort();
      const saved = {};
      names.forEach(n => { saved[n] = el.getAttribute(n); el.removeAttribute(n); });
      names.forEach(n => el.setAttribute(n, saved[n]));
      if (el.getAttribute('value') === '') el.removeAttribute('value');
      if (el.getAttribute('data-secb') === 'true') el.setAttribute('data-secb', '');
    });
    const walk = document.createTreeWalker(div, NodeFilter.SHOW_TEXT);
    const rm = [];
    while (walk.nextNode()) { const n = walk.currentNode, t = n.nodeValue;
      if (!t.trim()) rm.push(n); else n.nodeValue = t.replace(/[\u0660-\u0669]{2}:[\u0660-\u0669]{2}:[\u0660-\u0669]{2}/g, '\u23f1').replace(/\s+/g, ' '); }
    rm.forEach(n => n.remove());
    return div.innerHTML;
  };
  return norm;
})()
