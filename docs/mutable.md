# イミュータブルな操作について
React は、コンポーネントの変化をオブジェクトの差分チェックで検知している。つまり、イミュータブルな操作を行うことで変更前と変更後の情報をそれぞれ参照することができ、Reactが差分を検知できるようになる。