import { Button, Space } from 'antd-mobile';
import { isValidElement } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import IconFont from 'srcPath/components/iconfont';

type Options = {
  title: string;
  detail: string;
  primaryButton: string;
  actionsButton?: { text: string; onPress: () => void }[];
  message: any;
};

const ErrorPage: React.FC = () => {
  const history = useNavigate();
  const location = useLocation();
  const options: Options = location.state;

  return (
    <div className="flex h-screen items-center justify-center flex-col">
      <div className="mini-container">
        <div className="flex items-center mb-2">
          <IconFont name="jinggao" className="icon-size-big" />
          <h1 className="text-white  text-lg">{options?.title}</h1>
        </div>
        {isValidElement(options?.message) ? (
          <div className="mg_b_20 mg_t_10">{options?.message}</div>
        ) : (
          <p className="mg_b_20 mg_t_10 lineHeight_xs">{options?.message}</p>
        )}
        {options?.detail !== undefined ? (
          isValidElement(options?.detail) ? (
            options?.detail
          ) : (
            <details style={{maxHeight: '70vh', overflow: 'auto'}}>
              <summary>
                Detail:
              </summary>
              <pre style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>{options?.detail}</pre>
            </details>
          )
        ) : (
          ''
        )}
        <Space block justify="center">
          <Button color="primary" onClick={() => history(-1)} className="mt-14" style={{ width: 'auto', padding: '9px 50px' }}>
            {options?.primaryButton === undefined ? 'Try again' : options?.primaryButton}
          </Button>
        </Space>
        {options?.actionsButton
          ? options?.actionsButton.map(button => (
              <div className="textCenter">
                <p className="c_brand" onClick={button.onPress}>
                  {button.text}
                </p>
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

export default ErrorPage;
