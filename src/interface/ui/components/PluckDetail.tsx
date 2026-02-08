import type { Pluck } from "../../../domain/index.js";

const formatDate = (epochMs: number): string =>
  new Date(epochMs).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

type Props = {
  readonly pluck: Pluck;
};

export const PluckDetail = ({ pluck }: Props) => (
  <li class="pluck-detail">
    {formatDate(pluck.at as number)} — {pluck.source.title || pluck.source.url}
  </li>
);
