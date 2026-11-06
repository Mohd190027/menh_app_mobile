'use client';
/* ضمين — ui.tsx
 * المكوّنات المشتركة: Img (بديل imgTag بنفس onerror الاحتياطي)، Stars (بديل STARS)،
 * ModalHost (يعادل #modals في الأصل: mback + mcard بنفس البنية)، zoomImg.
 */
import { cloneElement } from 'react';
import { esc, hash } from './core';
import { useModalTick, getModal, closeModal, openModal } from './store';

/* imgTag (السطر ١٠) — نفس الصورة ونفس البذورة الاحتياطية picsum (مرة واحدة كما في onerror الأصلي) */
export function Img({ src, cls, alt }){
  const s = src || '';
  const seed = 'd' + (hash(s + alt) % 9973);
  return <img
    src={s}
    className={cls || ''}
    alt={alt || 'صورة'}
    loading="lazy"
    onError={e => { const el = e.currentTarget; if ((el as HTMLElement).dataset.fbk) return; (el as HTMLElement).dataset.fbk = '1'; el.src = 'https://picsum.photos/seed/' + seed + '/700/700'; }}
  />;
}

/* STARS (السطر ١٦) */
export function Stars({ r }){
  r = Math.round(r);
  return <span className="stars">{'★'.repeat(r)}{'☆'.repeat(5 - r)}</span>;
}

/* النافذة: openModal في الأصل (السطر ٦٤٥)
 * <div id="modals"><div class="mback" onclick="if(event.target===this)closeModal()"><div class="mcard {cls}">{html}</div></div></div>
 * ملاحظة: cloneElement بمفتاح modalTick يضمن remount كامل عند كل openModal — نفس أثر innerHTML في الأصل. */
export function ModalHost(){
  const tick = useModalTick();
  const m = getModal();
  return (
    <div id="modals">
      {m && m.node ? (
        <div className="mback" onClick={e => { if (e.target === e.currentTarget) closeModal() }}>
          <div className={'mcard ' + (m.cls || '')}>{cloneElement(m.node, { key: tick })}</div>
        </div>
      ) : null}
    </div>
  );
}

/* zoomImg (السطر ٦٤٧) */
export function zoomImg(src){
  openModal(
    <div>
      <div className="mhead"><b>عرض الصورة</b><button className="x" onClick={() => closeModal()}>✕</button></div>
      <div className="mbody" style={{ textAlign: 'center' }}>
        <img src={src} style={{ width: '100%', borderRadius: '16px', border: '1px solid var(--line)' }} />
      </div>
    </div>
  );
}
