library('delivery')
library('kkb-flow-plugin')

delivery {
    apply plugin: "flow"
    apply plugin: "kkb_flow"
    
    config {
        name = "kkb-wx"
				release_repo = "mos/kkb-wx"
        version = "1.0.0-${env.COMMIT_ID}"
        k8s_namespaces=["dev":"kkb-dev","test":"kkb-test","pre":"mos-pre","prod":"mos-prod"]

    }
}
