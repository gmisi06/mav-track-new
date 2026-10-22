import type {
  DataDrivenPropertyValueSpecification,
  Map as MapLibreMap,
} from "maplibre-gl";

const replaceEnglishName = (expression: unknown): unknown => {
  if (!Array.isArray(expression)) return expression;
  if (expression[0] === "get" && expression[1] === "name_en") {
    return ["get", "name"];
  }
  return expression.map(replaceEnglishName);
};

// Az OpenFreeMap stílusai az angol nevet részesítik előnyben ("Hungary"),
// a korábbi OSM térképhez hasonlóan a helyi nevet jelenítjük meg ("Magyarország").
export const localizeLabels = (map: MapLibreMap) => {
  for (const layer of map.getStyle().layers) {
    if (layer.type !== "symbol") continue;

    const textField = map.getLayoutProperty(layer.id, "text-field");
    if (!JSON.stringify(textField ?? null).includes("name_en")) continue;

    map.setLayoutProperty(
      layer.id,
      "text-field",
      replaceEnglishName(textField) as DataDrivenPropertyValueSpecification<string>
    );
  }
};
