import "./preview.css";
import { useEffect, useRef } from "react";

interface PreviewProps {
  code: string;
  err: string;
}

const html = `
    <html>
      <head>
        <style>html { background-color: white; }</style>
      </head>
      <body>
        <div id="root"></div>
        <script>
          const handleError = (err) => {
            const root = document.querySelector('#root');
            root.innerHTML = '<div style="color:red;"><h4>Rutime Error</h4>' + err + '</div>';
            console.error(err);
          };

          window.addEventListener('error',(event) => {
            event.preventDefault();
            handleError(event.error);
          });

          window.addEventListener('message', (event) => {
            try{
              eval(event.data);
            }catch(err){
              handleError(err);
            }
          },false);
        </script>
      </body>
    </html>
  `;

const Preview: React.FC<PreviewProps> = ({ code, err }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    iframe.current.srcdoc = html;
    setTimeout(() => {
      /*
    postMessage 사용법
    - 문법 : targetWindow.postMessage(message, targetOrigin, [transfer]);
    targetWindow : 메세지를 전달 받을 window의 참조
    message : 다른 widnow에 보내질 데이터
    targetOrigin : targetWindow의 origin을 지정. '*'은 별도로 지정하지 않음을 나타냄. 문자열 혹은 URI를 지정해야함
                  이벤트를 전송하려 할 때 targetWindow의 스키마, 호스트이름, 포트가 targetOrigin과 맞지 않다면 이벤트는 전송되지 않음

    */
      iframe.current.contentWindow.postMessage(code, "*");
    }, 50);
  }, [code]);

  //Set sandbox property of iframe to "" or other things except "allow-same-origin"", to prevent direct access from and to parent HTML document.
  return (
    <div className="preview-wrapper">
      <iframe
        title="preview"
        ref={iframe}
        srcDoc={html}
        sandbox="allow-scripts"
      />
      {err && <div className="preview-error">{err}</div>}
    </div>
  );
};
export default Preview;
