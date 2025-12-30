import { IconProps } from "../IconProps";
import { toFluentProps } from "../iconFluentAdapter";

export default function SearchIcon(props: IconProps) {
  const { size } = props;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <circle cx="10" cy="10" r="7" stroke="currentColor" fill="none" />
      <line x1="15" y1="15" x2="22" y2="22" stroke="currentColor" />
    </svg>
  );
}
