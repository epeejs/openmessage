export type ActionType = 'ready' | 'loadfail' | 'message' | 'cancel' | 'ok';

export interface MessageAction {
  type: ActionType;
  payload?: any;
}
