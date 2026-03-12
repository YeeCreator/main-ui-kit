import type { TabContentType } from '../../generated/templateConfig';
import { BusinessPlaceholder } from '../business/BusinessPlaceholder';
import { X6FlowCanvas } from '../integrations/x6/X6FlowCanvas';

/**
 * 剥离层内容路由参数。
 */
export interface DetachedContentRouterProps {
  contentType: TabContentType;
}

/**
 * 根据内容类型渲染剥离层模块。
 * @param props 路由参数。
 * @returns React 组件。
 */
export function DetachedContentRouter(props: DetachedContentRouterProps) {
  if (props.contentType === 'flow-canvas') {
    return <X6FlowCanvas />;
  }

  return <BusinessPlaceholder />;
}
