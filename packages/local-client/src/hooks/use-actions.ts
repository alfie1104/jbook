import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../state";

export const useActions = () => {
  const dispatch = useDispatch();

  /*
  원래 dispatch(actionCreators.XXXX(인자))를 매번 직접 호출해야하지만 귀찮음
  귀찮음을 해결하기 위해 bindActionCreators를 사용하여 actionCreator와 dispatch를 하나로 연결시킴

  사용시에는 다음과 같이 사용
  const { updateCell } = useActions(); //actionCreators에 updateCell을 생성해놨음
  updateCell(인자);  <-- 기존 dispatch(actionCreators.updateCell(인자))와 동일한 효과
  */

  return useMemo(() => {
    return bindActionCreators(actionCreators, dispatch);
  }, [dispatch]);
};
