interface SkeletonCardConfig {
  colSpan?: string;
  height?: string;
  hasHeader?: boolean;
  hasFooter?: boolean;
  contentLines?: number;
  customContent?: React.ReactNode;
}

export interface SkeletonProps {
  titleWidth?: string;
  subtitleWidth?: string;
  cards: SkeletonCardConfig[];
}