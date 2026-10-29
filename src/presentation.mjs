export const presentation={
 sokolov:{background:'#3d6681',foreground:'#d5dedd',copy:'#ffffff',surface:'#ffffff',card:'#eee9e2',logo:'sokolov'},
 wikkeo:{background:'#f5f8ff',foreground:'#223bdd',copy:'#0c0c0c',surface:'#ffffff',card:'#223bdd',logo:'wikkeo'},
 indriver:{background:'#243126',foreground:'#c1f11d',copy:'#c1f11d',surface:'#ffffff',card:'#c1f11d',logo:'indrive'}
};
export const projectPresentation=slug=>presentation[slug]||presentation.sokolov;
