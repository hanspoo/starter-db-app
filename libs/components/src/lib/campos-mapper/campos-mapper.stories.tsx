import { ComponentStory, ComponentMeta } from '@storybook/react';
import { CamposMapper } from './campos-mapper';

export default {
  component: CamposMapper,
  title: 'CamposMapper',
} as ComponentMeta<typeof CamposMapper>;

const Template: ComponentStory<typeof CamposMapper> = (args) => (
  <CamposMapper {...args} />
);

const mappers: any = [
  {
    "id": 1,
    "nombre": "Campos en b2b Cencosud Estándar",
    "tipo": "B2B",
    "campos": [
      {
        "id": 1,
        "campo": "IDENT_LEGAL",
        "columna": 3
      },
      {
        "id": 2,
        "campo": "NOMBRE_CLIENTE",
        "columna": 4
      },
      {
        "id": 3,
        "campo": "UNIDAD_NEGOCIO",
        "columna": 37
      },
      {
        "id": 4,
        "campo": "COD_LOCAL",
        "columna": 13
      },
      {
        "id": 5,
        "campo": "NOMBRE_LOCAL",
        "columna": 14
      },
      {
        "id": 6,
        "campo": "COD_CENCOSUD",
        "columna": 16
      },
      {
        "id": 7,
        "campo": "COD_PRODUCTO",
        "columna": 17
      },
      {
        "id": 8,
        "campo": "CANTIDAD",
        "columna": 23
      },
      {
        "id": 9,
        "campo": "NUM_ORDEN",
        "columna": 1
      },
      {
        "id": 10,
        "campo": "FEC_EMISION",
        "columna": 7
      },
      {
        "id": 11,
        "campo": "FEC_ENTREGA",
        "columna": 8
      }
    ]
  }
]

export const Primary = Template.bind({});
Primary.args = { mappers };
