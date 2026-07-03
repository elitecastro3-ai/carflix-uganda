import React from "react";

const shimmer = {
  background:
    "linear-gradient(90deg,#eeeeee 25%,#f5f5f5 37%,#eeeeee 63%)",
  backgroundSize: "400% 100%",
  animation: "shimmer 1.3s infinite",
};

export const SkeletonStyle = () => (
  <style>{`
    @keyframes shimmer{
      0%{background-position:100% 0}
      100%{background-position:-100% 0}
    }
  `}</style>
);

export const SkeletonBox = ({
  width="100%",
  height=16,
  radius=8,
  style={}
})=>(
<div
style={{
width,
height,
borderRadius:radius,
...shimmer,
...style
}}
/>
);

export const CarCardSkeleton = () => (
<div
style={{
background:"#fff",
borderRadius:18,
overflow:"hidden",
boxShadow:"0 4px 12px rgba(0,0,0,.08)"
}}
>

<SkeletonBox
height={200}
radius={0}
/>

<div style={{padding:16}}>

<SkeletonBox
width="70%"
height={22}
/>

<SkeletonBox
width="40%"
height={18}
style={{marginTop:10}}
/>

<SkeletonBox
width="60%"
height={15}
style={{marginTop:10}}
/>

<SkeletonBox
width="100%"
height={42}
radius={12}
style={{marginTop:20}}
/>

</div>

</div>
);

export const FeaturedCardSkeleton = () => (
<div
style={{
minWidth:320,
background:"#fff",
borderRadius:20,
overflow:"hidden",
boxShadow:"0 4px 12px rgba(0,0,0,.08)"
}}
>

<SkeletonBox
height={220}
radius={0}
/>

<div style={{padding:18}}>

<SkeletonBox
width="65%"
height={24}
/>

<SkeletonBox
width="35%"
height={18}
style={{marginTop:12}}
/>

</div>

</div>
);

export const ImportCardSkeleton = () => (
<div
style={{
background:"#fff",
borderRadius:18,
overflow:"hidden",
boxShadow:"0 4px 12px rgba(0,0,0,.08)"
}}
>

<SkeletonBox
height={180}
radius={0}
/>

<div style={{padding:16}}>

<SkeletonBox width="65%" height={22}/>

<SkeletonBox
width="40%"
height={16}
style={{marginTop:12}}
/>

<SkeletonBox
width="55%"
height={16}
style={{marginTop:10}}
/>

<SkeletonBox
width="100%"
height={40}
radius={10}
style={{marginTop:18}}
/>

</div>

</div>
);

export const CarDetailSkeleton = () => (
<>

<SkeletonStyle/>

<SkeletonBox
height={280}
radius={0}
/>

<div style={{padding:20}}>

<SkeletonBox
width="70%"
height={30}
/>

<SkeletonBox
width="35%"
height={22}
style={{marginTop:16}}
/>

<SkeletonBox
width="100%"
height={80}
style={{marginTop:24}}
/>

<SkeletonBox
width="100%"
height={120}
style={{marginTop:20}}
/>

<SkeletonBox
width="100%"
height={52}
radius={14}
style={{marginTop:26}}
/>

</div>

</>
);

export const FeaturedSkeleton = ({count=4})=>(

<>

<SkeletonStyle/>

<div
style={{
display:"flex",
gap:20,
overflow:"hidden"
}}
>

{Array.from({length:count}).map((_,i)=>(

<FeaturedCardSkeleton key={i}/>

))}

</div>

</>

);

export const ButtonSkeleton = ({
  width = "100%",
  height = 48,
  radius = 14,
}) => (
  <SkeletonBox
    width={width}
    height={height}
    radius={radius}
  />
);

export const PillSkeleton = ({
  width = 80,
  height = 28,
}) => (
  <SkeletonBox
    width={width}
    height={height}
    radius={50}
  />
);

export const TextSkeleton = ({
  lines = 3,
}) => (
  <>
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonBox
        key={i}
        width={i === lines - 1 ? "70%" : "100%"}
        height={14}
        style={{
          marginBottom: 10,
        }}
      />
    ))}
  </>
);

export const FabSkeleton = () => (
  <SkeletonBox
    width={60}
    height={60}
    radius={999}
  />
);
