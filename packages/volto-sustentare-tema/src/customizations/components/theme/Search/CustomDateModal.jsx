import React, { useRef } from 'react';
import './CustomDateModal.css';

function CustomDateModal({ open, onClose, onApply, from, to, setFrom, setTo }) {
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);
  if (!open) return null;

  function openDatePicker(ref) {
    if (ref.current) {
      if (typeof ref.current.showPicker === 'function') {
        ref.current.showPicker();
      } else {
        ref.current.focus();
      }
    }
  }
  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }
  function handleOverlayKeyDown(e) {
    if (e.key === 'Escape') {
      onClose();
    }
  }
  return (
    <div
      className="custom-date-modal-overlay"
      role="presentation"
      onClick={handleOverlayClick}
    >
      <button
        type="button"
        aria-label="Fechar modal"
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
          border: 0,
        }}
        onKeyDown={handleOverlayKeyDown}
        tabIndex={0}
        onFocus={(e) => e.target.blur()}
      />
      <div className="custom-date-modal" role="dialog" aria-modal="true">
        <div className="custom-date-modal-header">
          <span>INTERVALO PERSONALIZADO</span>
          <button
            className="custom-date-modal-close"
            onClick={onClose}
            title="Fechar"
            aria-label="Fechar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="18"
              viewBox="0 0 17 18"
              fill="none"
            >
              <path
                d="M17 3.33301L11.333 9L17 14.667L14.166 17.5L8.49902 11.833L2.83301 17.5L0 14.667L5.66602 9L0 3.33301L2.83301 0.5L8.5 6.16699L14.167 0.5L17 3.33301Z"
                fill="#00B033"
              />
            </svg>
          </button>
        </div>
        <div className="custom-date-modal-body">
          <div className="custom-date-modal-field">
            <label>De:</label>
            <div className="custom-date-input-wrapper">
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                ref={fromInputRef}
                max={to || undefined}
              />
              <button
                type="button"
                className="custom-calendar-icon"
                tabIndex={-1}
                aria-label="Abrir calendário"
                onClick={() => openDatePicker(fromInputRef)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  margin: 0,
                  cursor: 'pointer',
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="21"
                  viewBox="0 0 20 21"
                  fill="none"
                >
                  <path
                    d="M3.63636 0V0.913043H0V21H20V0.913043H16.3636V0H14.5455V0.913043H5.45455V0H3.63636ZM1.81818 2.73913H3.63636V3.65217H5.45455V2.73913H14.5455V3.65217H16.3636V2.73913H18.1818V4.56522H1.81818V2.73913ZM1.81818 6.3913H18.1818V19.1739H1.81818V6.3913ZM7.27273 8.21739V10.0435H9.09091V8.21739H7.27273ZM10.9091 8.21739V10.0435H12.7273V8.21739H10.9091ZM14.5455 8.21739V10.0435H16.3636V8.21739H14.5455ZM3.63636 11.8696V13.6957H5.45455V11.8696H3.63636ZM7.27273 11.8696V13.6957H9.09091V11.8696H7.27273ZM10.9091 11.8696V13.6957H12.7273V11.8696H10.9091ZM14.5455 11.8696V13.6957H16.3636V11.8696H14.5455ZM3.63636 15.5217V17.3478H5.45455V15.5217H3.63636ZM7.27273 15.5217V17.3478H9.09091V15.5217H7.27273ZM10.9091 15.5217V17.3478H12.7273V15.5217H10.9091Z"
                    fill="#00B033"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="custom-date-modal-field">
            <label>Até:</label>
            <div className="custom-date-input-wrapper">
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                ref={toInputRef}
                min={from || undefined}
              />
              <button
                type="button"
                className="custom-calendar-icon"
                tabIndex={-1}
                aria-label="Abrir calendário"
                onClick={() => openDatePicker(toInputRef)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  margin: 0,
                  cursor: 'pointer',
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="21"
                  viewBox="0 0 20 21"
                  fill="none"
                >
                  <path
                    d="M3.63636 0V0.913043H0V21H20V0.913043H16.3636V0H14.5455V0.913043H5.45455V0H3.63636ZM1.81818 2.73913H3.63636V3.65217H5.45455V2.73913H14.5455V3.65217H16.3636V2.73913H18.1818V4.56522H1.81818V2.73913ZM1.81818 6.3913H18.1818V19.1739H1.81818V6.3913ZM7.27273 8.21739V10.0435H9.09091V8.21739H7.27273ZM10.9091 8.21739V10.0435H12.7273V8.21739H10.9091ZM14.5455 8.21739V10.0435H16.3636V8.21739H14.5455ZM3.63636 11.8696V13.6957H5.45455V11.8696H3.63636ZM7.27273 11.8696V13.6957H9.09091V11.8696H7.27273ZM10.9091 11.8696V13.6957H12.7273V11.8696H10.9091ZM14.5455 11.8696V13.6957H16.3636V11.8696H14.5455ZM3.63636 15.5217V17.3478H5.45455V15.5217H3.63636ZM7.27273 15.5217V17.3478H9.09091V15.5217H7.27273ZM10.9091 15.5217V17.3478H12.7273V15.5217H10.9091Z"
                    fill="#00B033"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="custom-date-modal-footer">
          <button className="custom-date-modal-apply" onClick={onApply}>
            FILTRAR
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomDateModal;
